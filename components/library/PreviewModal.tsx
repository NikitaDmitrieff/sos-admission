'use client';

import { X, FileText, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
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
    <Dialog open={!!pdf} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] p-0">
        <div className="flex h-full">
          {/* PDF Viewer Area */}
          <div className="flex-1 bg-muted flex items-center justify-center relative">
            <div className="text-center p-8">
              <FileText className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">PDF Preview</h3>
              <p className="text-sm text-muted-foreground mb-4">
                PDF viewer will be integrated here
              </p>
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in New Tab
              </Button>
            </div>
          </div>

          {/* Metadata Sidebar */}
          <div className="w-80 border-l flex flex-col">
            <DialogHeader className="p-6 pb-4">
              <DialogTitle className="text-base leading-tight pr-8">
                {pdf.title}
              </DialogTitle>
            </DialogHeader>

            <ScrollArea className="flex-1 px-6">
              <div className="space-y-6 pb-6">
                {/* School & Country */}
                <div>
                  <p className="text-sm font-medium mb-1">School</p>
                  <p className="text-sm text-muted-foreground">{pdf.school}</p>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1">Country</p>
                  <p className="text-sm text-muted-foreground">{pdf.country}</p>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1">Level</p>
                  <p className="text-sm text-muted-foreground">{pdf.level}</p>
                </div>

                {/* Description */}
                <div>
                  <p className="text-sm font-medium mb-2">Description</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {pdf.description}
                  </p>
                </div>

                {/* Tags */}
                <div>
                  <p className="text-sm font-medium mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {pdf.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Updated Date */}
                <div>
                  <p className="text-sm font-medium mb-1">Last Updated</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(pdf.updatedAt), 'MMMM d, yyyy')}
                  </p>
                </div>

                {/* Related PDFs */}
                {relatedPdfs.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium mb-3">Related PDFs</p>
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
                            className="w-full text-left p-2 rounded-md hover:bg-accent transition-colors"
                          >
                            <p className="text-sm font-medium line-clamp-2">
                              {relatedPdf.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {relatedPdf.school}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

