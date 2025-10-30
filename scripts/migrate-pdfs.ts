import { createClient } from '@supabase/supabase-js';
import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
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
  title: string;
  school: string;
  country: string;
  level: 'Undergraduate' | 'Graduate' | 'General';
  tags: string[];
  description: string;
}

async function ensureBucketExists() {
  console.log('\n📦 Checking storage bucket...');
  
  // Check if bucket exists
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

function sanitizeFilename(filename: string): string {
  return filename
    .normalize('NFD') // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-zA-Z0-9.-]/g, '-') // Replace special chars with dash
    .replace(/-+/g, '-') // Replace multiple dashes with single dash
    .replace(/^-|-$/g, ''); // Remove leading/trailing dashes
}

async function uploadPDF(filePath: string, filename: string): Promise<string> {
  console.log(`\n📤 Uploading ${filename}...`);
  
  try {
    const fileBuffer = await readFile(filePath);
    const sanitizedFilename = sanitizeFilename(filename);
    const storagePath = `${Date.now()}-${sanitizedFilename}`;
    
    const { data, error } = await supabase.storage
      .from('pdfs')
      .upload(storagePath, fileBuffer, {
        contentType: 'application/pdf',
        upsert: false,
      });
    
    if (error) {
      console.error(`❌ Error uploading ${filename}:`, error);
      throw error;
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('pdfs')
      .getPublicUrl(data.path);
    
    console.log(`✅ Uploaded: ${data.path}`);
    return urlData.publicUrl;
  } catch (error) {
    console.error(`❌ Failed to upload ${filename}:`, error);
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

async function migratePDFs() {
  console.log('🚀 Starting PDF migration...\n');
  
  try {
    // Ensure bucket exists
    await ensureBucketExists();
    
    // Load metadata
    const metadataPath = join(__dirname, 'pdf-metadata.json');
    const metadataContent = await readFile(metadataPath, 'utf-8');
    const pdfMetadata: PDFMetadata[] = JSON.parse(metadataContent);
    
    console.log(`\n📋 Found ${pdfMetadata.length} PDFs to migrate`);
    
    // Get list of files in data_sample
    const dataSamplePath = join(__dirname, '..', 'data_sample');
    const files = await readdir(dataSamplePath);
    const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'));
    
    console.log(`📁 Found ${pdfFiles.length} PDF files in data_sample/`);
    
    let successCount = 0;
    let errorCount = 0;
    
    // Process each PDF
    for (const metadata of pdfMetadata) {
      try {
        // Find matching file (handle potential whitespace differences)
        const matchingFile = pdfFiles.find(
          file => file.trim() === metadata.filename.trim()
        );
        
        if (!matchingFile) {
          console.warn(`⚠️  File not found: ${metadata.filename}`);
          errorCount++;
          continue;
        }
        
        const filePath = join(dataSamplePath, matchingFile);
        
        // Upload PDF
        const url = await uploadPDF(filePath, matchingFile);
        
        // Insert metadata
        await insertPDFMetadata(metadata, url);
        
        successCount++;
      } catch (error) {
        console.error(`\n❌ Failed to process ${metadata.filename}:`, error);
        errorCount++;
      }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 Migration Summary:');
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${errorCount}`);
    console.log('='.repeat(50));
    
    if (errorCount > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migratePDFs();

