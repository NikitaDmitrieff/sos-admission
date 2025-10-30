'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, User, MessageSquare, FolderKanban, FileText, Search } from 'lucide-react';
import { searchPDFs, type PDF } from '@/lib/data/pdfs';

const navigationItems = [
  { title: 'Library', href: '/library', icon: BookOpen },
  { title: 'Profile', href: '/profile', icon: User },
  { title: 'AI Coach', href: '/ai-coach', icon: MessageSquare },
  { title: 'Processes', href: '/processes', icon: FolderKanban },
];

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PDF[]>([]);
  const [filteredNavItems, setFilteredNavItems] = useState(navigationItems);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length > 0) {
        setIsActive(true);

        try {
          const results = await searchPDFs(query);
          setSearchResults(results);
        } catch (error) {
          console.error('Failed to search PDFs:', error);
          setSearchResults([]);
        }

        const lowerQuery = query.toLowerCase();
        const filtered = navigationItems.filter((item) =>
          item.title.toLowerCase().includes(lowerQuery)
        );
        setFilteredNavItems(filtered);
      } else {
        setIsActive(false);
        setSearchResults([]);
        setFilteredNavItems(navigationItems);
      }
    };

    const debounce = setTimeout(fetchResults, 200);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleNavigate = (href: string) => {
    router.push(href);
  };

  return (
    <div
      // Stable layout: no conditional flipping between centered and padded states
      className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-start px-8 pt-32"
    >
      {/* Title — collapses vertically & fades; search bar rises into this space */}
      <div
        className={`w-full max-w-xl overflow-hidden transition-[max-height,opacity] duration-600 ease-out ${
          isActive ? 'max-h-0 opacity-0' : 'max-h-[120px] opacity-100'
        }`}
        style={{ willChange: 'max-height, opacity' }}
      >
        <h1 className="text-6xl font-medium text-center leading-tight mb-8">SOS Admissions</h1>
      </div>

      {/* Search Container */}
      <div className="w-full max-w-xl">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search PDFs or navigate..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-12 pl-10 pr-4 text-sm bg-background border focus:outline-none focus:border-foreground transition-colors"
            style={{ borderRadius: 0 }}
            autoFocus
          />
        </div>

        {/* Quick Action Buttons - Only show when not active */}
        {!isActive && (
          <div className="flex flex-wrap gap-3 mt-6 justify-center">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.href}
                  onClick={() => handleNavigate(item.href)}
                  className="flex items-center gap-2 px-4 py-2 text-xs text-muted-foreground hover:text-foreground border hover:border-foreground transition-colors"
                  style={{ borderRadius: 0 }}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Search Results - Only show when active */}
      {isActive && (
        <div className="w-full max-w-xl mt-6 space-y-4">
          {/* Navigation Results */}
          {filteredNavItems.length > 0 && (
            <div className="border bg-background shadow-lg" style={{ borderRadius: 0 }}>
              <div className="border-b px-6 py-3" style={{ borderRadius: 0 }}>
                <h3 className="text-xs font-medium text-muted-foreground">Navigation</h3>
              </div>
              <div className="divide-y">
                {filteredNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.href}
                      onClick={() => handleNavigate(item.href)}
                      className="w-full flex items-center px-6 py-3 text-sm hover:bg-foreground/5 text-left transition-colors"
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* PDF Results */}
          {searchResults.length > 0 && (
            <div className="border bg-background shadow-lg" style={{ borderRadius: 0 }}>
              <div className="border-b px-6 py-3" style={{ borderRadius: 0 }}>
                <h3 className="text-xs font-medium text-muted-foreground">
                  PDFs ({searchResults.length})
                </h3>
              </div>
              <div className="divide-y">
                {searchResults.slice(0, 10).map((pdf) => (
                  <button
                    key={pdf.id}
                    onClick={() => handleNavigate('/library')}
                    className="w-full flex items-start px-6 py-3 hover:bg-foreground/5 text-left transition-colors"
                  >
                    <FileText className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm truncate">{pdf.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {pdf.school} • {pdf.country}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {query.length > 0 && filteredNavItems.length === 0 && searchResults.length === 0 && (
            <div className="border bg-background shadow-lg" style={{ borderRadius: 0 }}>
              <div className="px-6 py-8 text-center">
                <p className="text-sm text-muted-foreground">No results found for "{query}"</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
