import { createClient } from '@supabase/supabase-js';
import { readFile, readdir, stat } from 'fs/promises';
import { join, basename } from 'path';
import { config } from 'dotenv';
import { Database } from '../lib/supabase/types';

// Load environment variables from .env.local
config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);
  process.exit(1);
}

// Create Supabase client with service role key for admin operations
const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

interface PDFMetadata {
  filename: string;
  fullPath: string;
  title: string;
  school: string[];
  country: string[];
  level: 'Undergraduate' | 'Graduate' | 'General';
  tags: string[];
  discipline_tags: string[];
  document_type: 'Outils' | 'Stratégie' | 'Ecole';
  description: string;
}

// Country mapping
const COUNTRY_MAPPING: Record<string, string> = {
  'UK': 'Royaume-Uni',
  'ROYAUME-UNI': 'Royaume-Uni',
  'BRITANNIQUES': 'Royaume-Uni',
  'FRANCE': 'France',
  'FRANÇAIS': 'France',
  'FRANCAIS': 'France',
  'CANADA': 'Canada',
  'ESPAGNE': 'Espagne',
  'ITALIE': 'Italie',
  'PORTUGAL': 'Portugal',
  'PAYS-BAS': 'Pays-Bas',
  'SUISSE': 'Suisse',
  'BELGIQUE': 'Belgique',
  'IRLANDE': 'Irlande',
  'ALLEMAGNE': 'Allemagne',
  'SUÈDE': 'Suède',
  'ETATS-UNIS': 'États-Unis',
  'USA': 'États-Unis',
  'ETRANGER': '', // Special case - will be handled separately
  'ÉTRANGÈRES': '', // Foreign in general
};

function sanitizeFilename(filename: string): string {
  return filename
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9.-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function extractCountries(path: string): string[] {
  const countries = new Set<string>();
  const upperPath = path.toUpperCase();
  
  for (const [key, value] of Object.entries(COUNTRY_MAPPING)) {
    if (value && upperPath.includes(key)) {
      countries.add(value);
    }
  }
  
  return Array.from(countries);
}

function extractTags(filename: string): string[] {
  const tags = new Set<string>();
  const cleanName = filename.replace('.pdf', '').toUpperCase();
  
  // Common keywords to extract
  const keywords = [
    'UCAS', 'PARCOURSUP', 'CV', 'PERSONAL STATEMENT', 
    'INTERVIEW', 'ENTRETIEN', 'MOTIVATION', 'REFERENCE',
    'BUSINESS', 'ENGINEERING', 'SOCIAL SCIENCES',
    'BRAINSTORMING', 'DRAFT', 'GUIDELINES', 'TIPS',
    'EXAMPLES', 'TEMPLATE', 'TRAME', 'CHECKLIST',
    'PROCEDURE', 'DEADLINES', 'PREDICTED GRADES',
    'BACHELOR', 'MASTER', 'PGE', 'SESAME', 'ACCES'
  ];
  
  for (const keyword of keywords) {
    if (cleanName.includes(keyword)) {
      tags.add(keyword.charAt(0) + keyword.slice(1).toLowerCase());
    }
  }
  
  return Array.from(tags);
}

function inferDocumentType(path: string): 'Outils' | 'Stratégie' | 'Ecole' {
  const upperPath = path.toUpperCase();
  
  if (upperPath.includes('LES OUTILS')) {
    return 'Outils';
  } else if (upperPath.includes('ELABORER UNE STRATEGIE')) {
    return 'Stratégie';
  } else if (upperPath.includes('CANDIDATER')) {
    return 'Ecole';
  }
  
  // Default to Outils for general purpose documents
  return 'Outils';
}

function inferDisciplineTags(path: string): string[] {
  const upperPath = path.toUpperCase();
  const disciplines: string[] = [];
  
  // Check for Business/Eco/Gestion
  if (upperPath.includes('BUSINESS') || 
      upperPath.includes('ECO') || 
      upperPath.includes('GESTION') ||
      upperPath.includes('MANAGEMENT') ||
      upperPath.includes('COMPTA') ||
      upperPath.includes('EXPERTISE') ||
      upperPath.includes('HOSPITALITY')) {
    disciplines.push('Économie, gestion et commerce');
  }
  
  // Check for Engineering
  if (upperPath.includes('ENGINEERING') || upperPath.includes('BIOLOGICAL')) {
    disciplines.push('Génie et technologies');
  }
  
  // Check for Social Sciences
  if (upperPath.includes('SOCIAL SCIENCES') || upperPath.includes('INTERNATIONAL RELATIONS')) {
    disciplines.push('Sciences sociales');
  }
  
  return disciplines;
}

function generateTitle(filename: string): string {
  return filename
    .replace('.pdf', '')
    .replace(/^[\s-]+|[\s-]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function generateDescription(metadata: PDFMetadata): string {
  const { document_type, title, country } = metadata;
  
  if (document_type === 'Outils') {
    if (title.toUpperCase().includes('CV')) {
      return `Modèle de CV pour candidatures${country.length ? ' ' + country.join(', ') : ''}. Document pratique pour structurer et présenter votre parcours académique et professionnel.`;
    } else if (title.toUpperCase().includes('PERSONAL STATEMENT')) {
      return `Guide pratique pour la rédaction de votre Personal Statement. Comprend des stratégies, exemples et conseils pour créer une candidature convaincante.`;
    } else if (title.toUpperCase().includes('ENTRETIEN') || title.toUpperCase().includes('INTERVIEW')) {
      return `Préparation aux entretiens de motivation. Questions types et conseils pour réussir vos entretiens de candidature.`;
    }
    return `Document pratique pour optimiser votre dossier de candidature. Outils et ressources pour maximiser vos chances d'admission.`;
  } else if (document_type === 'Stratégie') {
    const countryStr = country.length ? ` ${country.join(', ')}` : '';
    if (metadata.discipline_tags.includes('Économie, gestion et commerce')) {
      return `Guide stratégique pour les études de Business, Économie et Gestion${countryStr}. Panorama des écoles, programmes et procédures d'admission.`;
    }
    return `Guide stratégique pour élaborer votre liste d'écoles cibles${countryStr}. Aide à la construction d'une stratégie de candidature cohérente.`;
  } else { // Ecole
    const countryStr = country.length ? ` ${country.join(', ')}` : '';
    if (title.toUpperCase().includes('UCAS')) {
      return `Guide complet pour la procédure UCAS${countryStr}. Informations détaillées sur le processus de candidature aux universités britanniques.`;
    } else if (title.toUpperCase().includes('PARCOURSUP')) {
      return `Guide de candidature Parcoursup. Tout ce qu'il faut savoir pour réussir vos candidatures via la plateforme française.`;
    }
    return `Guide de candidature${countryStr}. Informations pratiques et procédures pour candidater aux établissements d'enseignement supérieur.`;
  }
}

async function ensureBucketExists() {
  console.log('\n📦 Checking storage bucket...');
  
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  
  if (listError) {
    console.error('❌ Error listing buckets:', listError);
    throw listError;
  }
  
  const bucketExists = buckets?.some(bucket => bucket.name === 'pdfs');
  
  if (!bucketExists) {
    console.log('Creating "pdfs" bucket...');
    const { error: createError } = await supabase.storage.createBucket('pdfs', {
      public: true,
      fileSizeLimit: 52428800, // 50MB
      allowedMimeTypes: ['application/pdf'],
    });
    
    if (createError) {
      console.error('❌ Error creating bucket:', createError);
      throw createError;
    }
    console.log('✅ Bucket created successfully');
  } else {
    console.log('✅ Bucket already exists');
  }
}

async function scanPDFsRecursively(dir: string, baseDir: string): Promise<PDFMetadata[]> {
  const pdfs: PDFMetadata[] = [];
  
  try {
    const entries = await readdir(dir);
    
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stats = await stat(fullPath);
      
      if (stats.isDirectory()) {
        // Recursively scan subdirectories
        const subPdfs = await scanPDFsRecursively(fullPath, baseDir);
        pdfs.push(...subPdfs);
      } else if (entry.toLowerCase().endsWith('.pdf')) {
        // Extract relative path for metadata inference
        const relativePath = fullPath.replace(baseDir, '');
        
        const metadata: PDFMetadata = {
          filename: entry,
          fullPath: fullPath,
          title: generateTitle(entry),
          school: ['General'],
          country: extractCountries(relativePath),
          level: 'Undergraduate',
          tags: extractTags(entry),
          discipline_tags: inferDisciplineTags(relativePath),
          document_type: inferDocumentType(relativePath),
          description: '', // Will be set after all other fields
        };
        
        // Generate description based on all metadata
        metadata.description = generateDescription(metadata);
        
        pdfs.push(metadata);
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dir}:`, error);
  }
  
  return pdfs;
}

async function uploadPDF(metadata: PDFMetadata): Promise<string> {
  console.log(`\n📤 Uploading ${metadata.filename}...`);
  
  try {
    const fileBuffer = await readFile(metadata.fullPath);
    const sanitizedFilename = sanitizeFilename(metadata.filename);
    const storagePath = `${Date.now()}-${sanitizedFilename}`;
    
    const { data, error } = await supabase.storage
      .from('pdfs')
      .upload(storagePath, fileBuffer, {
        contentType: 'application/pdf',
        upsert: false,
      });
    
    if (error) {
      console.error(`❌ Error uploading ${metadata.filename}:`, error);
      throw error;
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('pdfs')
      .getPublicUrl(data.path);
    
    console.log(`✅ Uploaded: ${data.path}`);
    return urlData.publicUrl;
  } catch (error) {
    console.error(`❌ Failed to upload ${metadata.filename}:`, error);
    throw error;
  }
}

async function insertPDFMetadata(metadata: PDFMetadata, url: string) {
  console.log(`\n💾 Inserting metadata for "${metadata.title}"...`);
  
  const { data, error } = await supabase
    .from('pdfs')
    .insert({
      title: metadata.title,
      school: metadata.school,
      country: metadata.country,
      level: metadata.level,
      tags: metadata.tags,
      discipline_tags: metadata.discipline_tags,
      document_type: metadata.document_type,
      description: metadata.description,
      url: url,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();
  
  if (error) {
    console.error('❌ Error inserting metadata:', error);
    throw error;
  }
  
  console.log(`✅ Metadata inserted with ID: ${data.id}`);
  return data;
}

async function uploadAllPDFs() {
  console.log('🚀 Starting bulk PDF upload...\n');
  
  try {
    // Ensure bucket exists
    await ensureBucketExists();
    
    // Scan for all PDFs
    const baseDir = '/Users/nikitadmitrieff/Desktop/Projects/coding/friends/romy_dmitrieff/SITE INTERNET - PDF';
    console.log(`\n📂 Scanning directory: ${baseDir}`);
    
    const pdfs = await scanPDFsRecursively(baseDir, baseDir);
    console.log(`\n📋 Found ${pdfs.length} PDFs to upload`);
    
    // Display summary of what will be uploaded
    console.log('\n📊 Upload Summary:');
    console.log('─'.repeat(60));
    pdfs.forEach((pdf, idx) => {
      console.log(`${idx + 1}. ${pdf.title}`);
      console.log(`   Type: ${pdf.document_type} | Countries: ${pdf.country.join(', ') || 'N/A'}`);
      console.log(`   Disciplines: ${pdf.discipline_tags.join(', ') || 'N/A'}`);
    });
    console.log('─'.repeat(60));
    
    let successCount = 0;
    let errorCount = 0;
    
    // Process each PDF
    for (let i = 0; i < pdfs.length; i++) {
      const metadata = pdfs[i];
      try {
        console.log(`\n[${i + 1}/${pdfs.length}] Processing: ${metadata.filename}`);
        
        // Upload PDF
        const url = await uploadPDF(metadata);
        
        // Insert metadata
        await insertPDFMetadata(metadata, url);
        
        successCount++;
      } catch (error) {
        console.error(`\n❌ Failed to process ${metadata.filename}:`, error);
        errorCount++;
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 Upload Summary:');
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${errorCount}`);
    console.log(`📦 Total: ${pdfs.length}`);
    console.log('='.repeat(60));
    
    if (errorCount > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Upload failed:', error);
    process.exit(1);
  }
}

// Run upload
uploadAllPDFs();


