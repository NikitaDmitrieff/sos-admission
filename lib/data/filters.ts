import { PDF } from './pdfs';

export type SortOption = 'title-asc' | 'title-desc' | 'date-desc' | 'date-asc';

export interface FilterState {
  tags: string[];
  countries: string[];
  levels: string[];
  schools: string[];
  searchQuery: string;
}

export function applyFilters(pdfs: PDF[], filters: FilterState): PDF[] {
  let filtered = [...pdfs];

  if (filters.tags.length > 0) {
    filtered = filtered.filter((pdf) =>
      filters.tags.some((tag) => pdf.tags.includes(tag))
    );
  }

  if (filters.countries.length > 0) {
    filtered = filtered.filter((pdf) =>
      filters.countries.includes(pdf.country)
    );
  }

  if (filters.levels.length > 0) {
    filtered = filtered.filter((pdf) => filters.levels.includes(pdf.level));
  }

  if (filters.schools.length > 0) {
    filtered = filtered.filter((pdf) => filters.schools.includes(pdf.school));
  }

  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (pdf) =>
        pdf.title.toLowerCase().includes(query) ||
        pdf.school.toLowerCase().includes(query) ||
        pdf.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  return filtered;
}

export function applySorting(pdfs: PDF[], sort: SortOption): PDF[] {
  const sorted = [...pdfs];

  switch (sort) {
    case 'title-asc':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'title-desc':
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    case 'date-desc':
      return sorted.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    case 'date-asc':
      return sorted.sort(
        (a, b) =>
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      );
    default:
      return sorted;
  }
}

export function extractUniqueValues(pdfs: PDF[]) {
  const tags = new Set<string>();
  const countries = new Set<string>();
  const levels = new Set<string>();
  const schools = new Set<string>();

  pdfs.forEach((pdf) => {
    pdf.tags.forEach((tag) => tags.add(tag));
    countries.add(pdf.country);
    levels.add(pdf.level);
    schools.add(pdf.school);
  });

  return {
    tags: Array.from(tags).sort(),
    countries: Array.from(countries).sort(),
    levels: Array.from(levels).sort(),
    schools: Array.from(schools).sort(),
  };
}

