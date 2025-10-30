// PDF metadata types and data access layer
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/types';

type PDFRow = Database['public']['Tables']['pdfs']['Row'];

export interface PDF {
  id: string;
  title: string;
  school: string;
  country: string;
  level: 'Undergraduate' | 'Graduate' | 'General';
  tags: string[];
  description: string;
  url: string;
  updatedAt: string;
  createdAt: string;
}

// Transform database row to PDF interface
function transformPDF(row: PDFRow): PDF {
  return {
    id: row.id,
    title: row.title,
    school: row.school,
    country: row.country,
    level: row.level,
    tags: row.tags,
    description: row.description,
    url: row.url,
    updatedAt: row.updated_at,
    createdAt: row.created_at,
  };
}

export async function getAllPDFs(): Promise<PDF[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('pdfs')
    .select('*')
    .order('updated_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching PDFs:', error);
    throw new Error('Failed to fetch PDFs');
  }
  
  return (data || []).map(transformPDF);
}

export async function getPDFById(id: string): Promise<PDF | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('pdfs')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      // Not found
      return null;
    }
    console.error('Error fetching PDF:', error);
    throw new Error('Failed to fetch PDF');
  }
  
  return data ? transformPDF(data) : null;
}

export async function searchPDFs(query: string): Promise<PDF[]> {
  const supabase = createClient();
  const lowerQuery = query.toLowerCase();
  
  // Use Postgres text search with ilike for flexible matching
  const { data, error } = await supabase
    .from('pdfs')
    .select('*')
    .or(`title.ilike.%${lowerQuery}%,school.ilike.%${lowerQuery}%,description.ilike.%${lowerQuery}%`)
    .order('updated_at', { ascending: false });
  
  if (error) {
    console.error('Error searching PDFs:', error);
    throw new Error('Failed to search PDFs');
  }
  
  // Additional client-side filtering for tags
  const results = (data || []).filter(
    (pdf) =>
      pdf.title.toLowerCase().includes(lowerQuery) ||
      pdf.school.toLowerCase().includes(lowerQuery) ||
      pdf.description.toLowerCase().includes(lowerQuery) ||
      pdf.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
  
  return results.map(transformPDF);
}

