'use client';

import { FileText, Eye, FolderPlus } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PDF } from '@/lib/data/pdfs';
import { format } from 'date-fns';

interface BundleCardProps {
  pdf: PDF;
  viewMode?: 'grid' | 'list';
  onPreview: (pdf: PDF) => void;
}

export function BundleCard({ pdf, viewMode = 'grid', onPreview }: BundleCardProps) {
  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <div className="flex items-center p-4 gap-4">
          <div className="flex-shrink-0 w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{pdf.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {pdf.school} • {pdf.country}
            </p>
            <div className="flex flex-wrap gap-1 mt-2">
              {pdf.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {pdf.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{pdf.tags.length - 3}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:block">
              {format(new Date(pdf.updatedAt), 'MMM d, yyyy')}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPreview(pdf)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow group">
      <CardHeader className="pb-3">
        <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-3">
          <FileText className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-sm line-clamp-2 leading-tight">
          {pdf.title}
        </h3>
      </CardHeader>
      
      <CardContent className="pb-3">
        <p className="text-xs text-muted-foreground mb-3">
          {pdf.school}
        </p>
        <div className="flex flex-wrap gap-1">
          {pdf.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {pdf.tags.length > 2 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="text-xs cursor-help">
                    +{pdf.tags.length - 2}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {pdf.tags.slice(2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-3">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onPreview(pdf)}
        >
          <Eye className="h-4 w-4 mr-1" />
          Preview
        </Button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" disabled>
                <FolderPlus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Save to Process (Coming soon)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
}

