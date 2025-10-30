'use client';

import { X, FileText, ExternalLink } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PDF } from '@/lib/data/pdfs';
import { format } from 'date-fns';

interface PreviewModalProps {
  pdf: PDF | null;
  onClose: () => void;
  allPdfs: PDF[];
}

export function PreviewModal({ pdf, onClose, allPdfs }: PreviewModalProps) {
  if (!pdf) return null;

  // Find related PDFs (same tags or school)
  const relatedPdfs = allPdfs
    .filter(
      (p) =>
        p.id !== pdf.id &&
        (p.school === pdf.school || p.tags.some((tag) => pdf.tags.includes(tag)))
    )
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex items-center justify-center p-4">
      <div
        className="w-full max-w-6xl h-[90vh] border bg-background shadow-lg transition-all duration-300 flex"
        style={{ borderRadius: 0 }}
      >
        {/* PDF Viewer Area */}
        <div className="flex-1 bg-foreground/5 flex items-center justify-center relative border-r">
          <div className="text-center p-8">
            <div
              className="h-24 w-24 bg-foreground/5 flex items-center justify-center mx-auto mb-4"
              style={{ borderRadius: 0 }}
            >
              <FileText className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-base font-medium mb-2">PDF Preview</h3>
            <p className="text-xs text-muted-foreground mb-4">
              PDF viewer will be integrated here
            </p>
            <a
              href={pdf.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center h-9 px-3 text-sm bg-foreground text-background hover:bg-foreground/90 transition-all border border-foreground"
              style={{ borderRadius: 0 }}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in New Tab
            </a>
          </div>
        </div>

        {/* Metadata Sidebar */}
        <div className="w-80 flex flex-col">
          {/* Header */}
          <div
            className="border-b px-6 py-4 transition-all duration-300 relative"
            style={{ borderRadius: 0 }}
          >
            <h2 className="text-base font-medium pr-8 leading-tight">
              {pdf.title}
            </h2>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 h-9 w-9 flex items-center justify-center border hover:border-foreground transition-all"
              style={{ borderRadius: 0 }}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1">
            <div className="p-6 space-y-4">
              {/* School */}
              <div>
                <p className="text-xs font-medium mb-1">School</p>
                <p className="text-sm text-muted-foreground">{pdf.school}</p>
              </div>

              {/* Country */}
              <div>
                <p className="text-xs font-medium mb-1">Country</p>
                <p className="text-sm text-muted-foreground">{pdf.country}</p>
              </div>

              {/* Level */}
              <div>
                <p className="text-xs font-medium mb-1">Level</p>
                <p className="text-sm text-muted-foreground">{pdf.level}</p>
              </div>

              {/* Description */}
              <div>
                <p className="text-xs font-medium mb-1.5">Description</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {pdf.description}
                </p>
              </div>

              {/* Tags */}
              <div>
                <p className="text-xs font-medium mb-1.5">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {pdf.tags.map((tag) => (
                    <span
                      key={tag}
                      className="h-7 px-3 text-xs border bg-background flex items-center"
                      style={{ borderRadius: 0 }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Updated Date */}
              <div>
                <p className="text-xs font-medium mb-1">Last Updated</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(pdf.updatedAt), 'MMMM d, yyyy')}
                </p>
              </div>

              {/* Related PDFs */}
              {relatedPdfs.length > 0 && (
                <div className="pt-4 border-t">
                  <p className="text-xs font-medium mb-2">Related PDFs</p>
                  <div className="space-y-2">
                    {relatedPdfs.map((relatedPdf) => (
                      <button
                        key={relatedPdf.id}
                        onClick={() => {
                          onClose();
                          // In a real app, this would open the related PDF
                          setTimeout(() => {
                            // Re-open with the related PDF
                          }, 100);
                        }}
                        className="w-full text-left p-3 border hover:border-foreground transition-all"
                        style={{ borderRadius: 0 }}
                      >
                        <p className="text-sm font-medium line-clamp-2">
                          {relatedPdf.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {relatedPdf.school}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

