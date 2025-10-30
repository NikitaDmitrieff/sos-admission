// PDF metadata types and loaders
// TODO: Replace with Supabase client calls when migrating

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
}

export async function getAllPDFs(): Promise<PDF[]> {
  // TODO: Replace with: supabase.from('pdfs').select('*')
  const response = await fetch('/data/pdfs.json');
  const data = await response.json();
  return data;
}

export async function getPDFById(id: string): Promise<PDF | null> {
  // TODO: Replace with: supabase.from('pdfs').select('*').eq('id', id).single()
  const pdfs = await getAllPDFs();
  return pdfs.find((pdf) => pdf.id === id) || null;
}

export async function searchPDFs(query: string): Promise<PDF[]> {
  // TODO: Replace with full-text search via Supabase
  const pdfs = await getAllPDFs();
  const lowerQuery = query.toLowerCase();
  return pdfs.filter(
    (pdf) =>
      pdf.title.toLowerCase().includes(lowerQuery) ||
      pdf.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
      pdf.school.toLowerCase().includes(lowerQuery)
  );
}

