'use client';

import { useState, useEffect } from 'react';
import { Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FilterBar } from '@/components/library/FilterBar';
import { BundleCard } from '@/components/library/BundleCard';
import { PreviewModal } from '@/components/library/PreviewModal';
import { EmptyState } from '@/components/common/EmptyState';
import { PDFGridSkeleton } from '@/components/common/Loader';
import { getAllPDFs, type PDF } from '@/lib/data/pdfs';
import {
  applyFilters,
  applySorting,
  extractUniqueValues,
  type FilterState,
  type SortOption,
} from '@/lib/data/filters';

export default function LibraryPage() {
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [filteredPdfs, setFilteredPdfs] = useState<PDF[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [filters, setFilters] = useState<FilterState>({
    tags: [],
    countries: [],
    levels: [],
    schools: [],
    searchQuery: '',
  });
  const [previewPdf, setPreviewPdf] = useState<PDF | null>(null);
  const [availableFilters, setAvailableFilters] = useState({
    tags: [] as string[],
    countries: [] as string[],
    levels: [] as string[],
    schools: [] as string[],
  });

  // Load PDFs
  useEffect(() => {
    const loadPdfs = async () => {
      setLoading(true);
      try {
        const data = await getAllPDFs();
        setPdfs(data);
        setAvailableFilters(extractUniqueValues(data));
        
        // Apply initial filter and sort
        const filtered = applyFilters(data, filters);
        const sorted = applySorting(filtered, sortBy);
        setFilteredPdfs(sorted);
      } catch (error) {
        console.error('Failed to load PDFs:', error);
      } finally {
        setTimeout(() => setLoading(false), 300); // Simulate loading delay
      }
    };

    loadPdfs();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    const filtered = applyFilters(pdfs, filters);
    const sorted = applySorting(filtered, sortBy);
    setFilteredPdfs(sorted);
  }, [pdfs, filters, sortBy]);

  const handleClearFilters = () => {
    setFilters({
      tags: [],
      countries: [],
      levels: [],
      schools: [],
      searchQuery: '',
    });
  };

  return (
    <div className="container mx-auto py-6 px-4 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Library</h1>
          <p className="text-muted-foreground mt-1">
            Browse {pdfs.length} admission guides and resources
          </p>
        </div>
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'grid' | 'list')}>
          <TabsList>
            <TabsTrigger value="grid" aria-label="Grid view">
              <Grid className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="list" aria-label="List view">
              <List className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <FilterBar
          filters={filters}
          availableTags={availableFilters.tags}
          availableCountries={availableFilters.countries}
          availableLevels={availableFilters.levels}
          availableSchools={availableFilters.schools}
          sortBy={sortBy}
          onFiltersChange={setFilters}
          onSortChange={setSortBy}
          onClearAll={handleClearFilters}
        />
      </div>

      {/* Content */}
      {loading ? (
        <PDFGridSkeleton count={6} />
      ) : filteredPdfs.length === 0 ? (
        <EmptyState
          title="No PDFs found"
          description="Try adjusting your filters or clearing them to see more results."
          action={
            filters.tags.length > 0 ||
            filters.countries.length > 0 ||
            filters.levels.length > 0 ||
            filters.schools.length > 0
              ? {
                  label: 'Clear filters',
                  onClick: handleClearFilters,
                }
              : undefined
          }
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPdfs.map((pdf) => (
            <BundleCard
              key={pdf.id}
              pdf={pdf}
              viewMode="grid"
              onPreview={setPreviewPdf}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPdfs.map((pdf) => (
            <BundleCard
              key={pdf.id}
              pdf={pdf}
              viewMode="list"
              onPreview={setPreviewPdf}
            />
          ))}
        </div>
      )}

      {/* Preview Modal */}
      <PreviewModal
        pdf={previewPdf}
        onClose={() => setPreviewPdf(null)}
        allPdfs={pdfs}
      />
    </div>
  );
}

