'use client';

import { useState, useRef, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
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

interface FilterDropdownProps {
  label: string;
  options: string[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  count?: number;
}

function FilterDropdown({ label, options, selectedValues, onToggle, count }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`h-9 px-3 text-sm border transition-all flex items-center gap-2 ${
          selectedValues.length > 0
            ? 'bg-foreground text-background border-foreground'
            : 'bg-background text-foreground border hover:border-foreground'
        }`}
        style={{ borderRadius: 0 }}
      >
        {label}
        {count !== undefined && count > 0 && (
          <span className="text-xs">({count})</span>
        )}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className="absolute top-full mt-1 left-0 min-w-[250px] max-w-[400px] border bg-background shadow-lg z-50"
          style={{ borderRadius: 0 }}
        >
          <div className="p-4 max-h-[300px] overflow-y-auto">
            <div className="flex flex-wrap gap-2">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => onToggle(option)}
                  className={`h-7 px-3 text-xs border transition-all ${
                    selectedValues.includes(option)
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-background text-foreground border hover:border-foreground'
                  }`}
                  style={{ borderRadius: 0 }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
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
    <div
      className="border bg-background shadow-lg transition-all duration-300"
      style={{ borderRadius: 0 }}
    >
      <div className="p-6">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <input
            type="text"
            placeholder="Search..."
            value={filters.searchQuery}
            onChange={(e) => onFiltersChange({ ...filters, searchQuery: e.target.value })}
            className="w-[400px] h-9 px-3 text-sm bg-background border focus:outline-none focus:border-foreground transition-all"
            style={{ borderRadius: 0 }}
          />

          {/* Level Filter */}
          {availableLevels.length > 0 && (
            <FilterDropdown
              label="Level"
              options={availableLevels}
              selectedValues={filters.levels}
              onToggle={(value) => toggleFilter('levels', value)}
              count={filters.levels.length}
            />
          )}

          {/* Country Filter */}
          {availableCountries.length > 0 && (
            <FilterDropdown
              label="Country"
              options={availableCountries}
              selectedValues={filters.countries}
              onToggle={(value) => toggleFilter('countries', value)}
              count={filters.countries.length}
            />
          )}

          {/* School Filter */}
          {availableSchools.length > 0 && (
            <FilterDropdown
              label="School"
              options={availableSchools}
              selectedValues={filters.schools}
              onToggle={(value) => toggleFilter('schools', value)}
              count={filters.schools.length}
            />
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Clear all button */}
          {hasActiveFilters && (
            <button
              onClick={onClearAll}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear all
            </button>
          )}

          {/* Sort - Different visual treatment */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Sort:</span>
            <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
              <SelectTrigger className="w-[100px] h-9 text-sm border-0 bg-foreground/5 hover:bg-foreground/10 transition-all">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title-asc">A → Z</SelectItem>
                <SelectItem value="title-desc">Z → A</SelectItem>
                <SelectItem value="date-desc">Newest</SelectItem>
                <SelectItem value="date-asc">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
            {filters.levels.map((level) => (
              <button
                key={level}
                onClick={() => toggleFilter('levels', level)}
                className="h-7 px-3 text-xs border bg-foreground text-background border-foreground transition-all flex items-center gap-1.5"
                style={{ borderRadius: 0 }}
              >
                {level}
                <X className="h-3 w-3" />
              </button>
            ))}
            {filters.countries.map((country) => (
              <button
                key={country}
                onClick={() => toggleFilter('countries', country)}
                className="h-7 px-3 text-xs border bg-foreground text-background border-foreground transition-all flex items-center gap-1.5"
                style={{ borderRadius: 0 }}
              >
                {country}
                <X className="h-3 w-3" />
              </button>
            ))}
            {filters.schools.map((school) => (
              <button
                key={school}
                onClick={() => toggleFilter('schools', school)}
                className="h-7 px-3 text-xs border bg-foreground text-background border-foreground transition-all flex items-center gap-1.5"
                style={{ borderRadius: 0 }}
              >
                {school}
                <X className="h-3 w-3" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

