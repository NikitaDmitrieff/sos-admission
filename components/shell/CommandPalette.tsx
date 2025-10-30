'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, User, MessageSquare, FolderKanban, FileText } from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { searchPDFs, type PDF } from '@/lib/data/pdfs';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const navigationItems = [
  { title: 'Library', href: '/library', icon: BookOpen },
  { title: 'Profile', href: '/profile', icon: User },
  { title: 'AI Coach', href: '/ai-coach', icon: MessageSquare },
  { title: 'Processes', href: '/processes', icon: FolderKanban },
];

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PDF[]>([]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length > 0) {
        const results = await searchPDFs(query);
        setSearchResults(results.slice(0, 5)); // Limit to 5 results
      } else {
        setSearchResults([]);
      }
    };

    const debounce = setTimeout(fetchResults, 200);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelect = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search PDFs or navigate..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <CommandItem
                key={item.href}
                onSelect={() => handleSelect(item.href)}
              >
                <Icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>

        {searchResults.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="PDFs">
              {searchResults.map((pdf) => (
                <CommandItem
                  key={pdf.id}
                  onSelect={() => {
                    // For MVP, just navigate to library
                    // Later: open preview modal or navigate to PDF detail
                    handleSelect('/library');
                  }}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span>{pdf.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {pdf.school} • {pdf.country}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}

