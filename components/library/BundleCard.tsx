'use client';

import dynamic from 'next/dynamic';
import { FileText, Eye, FolderPlus } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PDF } from '@/lib/data/pdfs';
import { format } from 'date-fns';

const PDFThumbnail = dynamic(
  () => import('@/components/library/PDFViewer').then((mod) => mod.PDFThumbnail),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-foreground/5">
        <FileText className="h-5 w-5 text-muted-foreground" />
      </div>
    ),
  }
);

interface BundleCardProps {
  pdf: PDF;
  viewMode?: 'grid' | 'list';
  onPreview: (pdf: PDF) => void;
}

export function BundleCard({ pdf, viewMode = 'grid', onPreview }: BundleCardProps) {
  if (viewMode === 'list') {
    return (
      <div
        className="border bg-background shadow-lg transition-all duration-300"
        style={{ borderRadius: 0 }}
      >
        <div className="flex items-center p-6 gap-4">
          <div
            className="flex-shrink-0 w-12 h-12 bg-foreground/5 overflow-hidden"
            style={{ borderRadius: 0 }}
          >
            <PDFThumbnail url={pdf.url} className="w-full h-full" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium truncate">{pdf.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {pdf.school.join(', ') || 'General'} • {pdf.country.join(', ') || 'All'}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {pdf.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="h-7 px-3 text-xs border bg-background flex items-center"
                  style={{ borderRadius: 0 }}
                >
                  {tag}
                </span>
              ))}
              {pdf.tags.length > 3 && (
                <span
                  className="h-7 px-3 text-xs border bg-background flex items-center"
                  style={{ borderRadius: 0 }}
                >
                  +{pdf.tags.length - 3}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:block">
              {format(new Date(pdf.updatedAt), 'MMM d, yyyy')}
            </span>
            <button
              onClick={() => onPreview(pdf)}
              className="h-9 px-3 text-sm bg-foreground text-background hover:bg-foreground/90 transition-all border border-foreground"
              style={{ borderRadius: 0 }}
            >
              <Eye className="h-4 w-4 mr-2 inline" />
              Preview
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="border bg-background shadow-lg transition-all duration-300 flex flex-col h-full"
      style={{ borderRadius: 0 }}
    >
      {/* Header with thumbnail - Fixed height */}
      <div
        className="border-b px-6 py-4 transition-all duration-300"
        style={{ borderRadius: 0 }}
      >
        <div
          className="aspect-video bg-foreground/5 flex items-center justify-center mb-3 overflow-hidden"
          style={{ borderRadius: 0 }}
        >
          <PDFThumbnail url={pdf.url} className="w-full h-full" />
        </div>
        <h3 className="text-sm font-medium line-clamp-2 leading-tight h-10">
          {pdf.title}
        </h3>
      </div>
      
      {/* Content - Flex grow to fill space */}
      <div className="p-6 space-y-4 flex-1 flex flex-col">
        <p className="text-xs text-muted-foreground">
          {pdf.school.join(', ') || 'General'} {pdf.country.length > 0 && `• ${pdf.country.join(', ')}`}
        </p>
        <div className="flex flex-wrap gap-2">
          {pdf.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="h-7 px-3 text-xs border bg-background flex items-center"
              style={{ borderRadius: 0 }}
            >
              {tag}
            </span>
          ))}
          {pdf.tags.length > 2 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    className="h-7 px-3 text-xs border bg-background flex items-center cursor-help"
                    style={{ borderRadius: 0 }}
                  >
                    +{pdf.tags.length - 2}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="flex flex-wrap gap-2 max-w-xs">
                    {pdf.tags.slice(2).map((tag) => (
                      <span
                        key={tag}
                        className="h-7 px-3 text-xs border bg-background flex items-center"
                        style={{ borderRadius: 0 }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      {/* Footer - Fixed at bottom */}
      <div
        className="border-t px-6 py-3 transition-all duration-300 flex gap-2 mt-auto"
        style={{ borderRadius: 0 }}
      >
        <button
          onClick={() => onPreview(pdf)}
          className="flex-1 h-9 text-sm bg-foreground text-background hover:bg-foreground/90 transition-all border border-foreground"
          style={{ borderRadius: 0 }}
        >
          <Eye className="h-4 w-4 mr-1 inline" />
          Preview
        </button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                disabled
                className="h-9 w-9 flex items-center justify-center bg-background text-foreground border disabled:opacity-50 transition-all"
                style={{ borderRadius: 0 }}
              >
                <FolderPlus className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Save to Process (Coming soon)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

