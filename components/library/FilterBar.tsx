'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FilterState, SortOption } from '@/lib/data/filters';

interface FilterBarProps {
  filters: FilterState;
  availableTags: string[];
  availableCountries: string[];
  availableLevels: string[];
  availableSchools: string[];
  sortBy: SortOption;
  onFiltersChange: (filters: FilterState) => void;
  onSortChange: (sort: SortOption) => void;
  onClearAll: () => void;
}

export function FilterBar({
  filters,
  availableTags,
  availableCountries,
  availableLevels,
  availableSchools,
  sortBy,
  onFiltersChange,
  onSortChange,
  onClearAll,
}: FilterBarProps) {
  const hasActiveFilters =
    filters.tags.length > 0 ||
    filters.countries.length > 0 ||
    filters.levels.length > 0 ||
    filters.schools.length > 0;

  const toggleFilter = (
    type: keyof FilterState,
    value: string
  ) => {
    const currentValues = filters[type] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    onFiltersChange({
      ...filters,
      [type]: newValues,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="title-asc">Title (A-Z)</SelectItem>
            <SelectItem value="title-desc">Title (Z-A)</SelectItem>
            <SelectItem value="date-desc">Recently Added</SelectItem>
            <SelectItem value="date-asc">Oldest First</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value=""
          onValueChange={(value) => toggleFilter('levels', value)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            {availableLevels.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value=""
          onValueChange={(value) => toggleFilter('countries', value)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent>
            {availableCountries.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value=""
          onValueChange={(value) => toggleFilter('schools', value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="School" />
          </SelectTrigger>
          <SelectContent>
            {availableSchools.map((school) => (
              <SelectItem key={school} value={school}>
                {school}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearAll}>
            Clear all
          </Button>
        )}
      </div>

      {/* Active filter chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.levels.map((level) => (
            <Badge key={level} variant="secondary" className="gap-1">
              {level}
              <button
                onClick={() => toggleFilter('levels', level)}
                className="ml-1 hover:bg-muted rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.countries.map((country) => (
            <Badge key={country} variant="secondary" className="gap-1">
              {country}
              <button
                onClick={() => toggleFilter('countries', country)}
                className="ml-1 hover:bg-muted rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.schools.map((school) => (
            <Badge key={school} variant="secondary" className="gap-1">
              {school}
              <button
                onClick={() => toggleFilter('schools', school)}
                className="ml-1 hover:bg-muted rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

