'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { FileText, Loader2 } from 'lucide-react';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  url: string;
  pageNumber?: number;
  width?: number;
  height?: number;
  scale?: number;
  className?: string;
  onLoadSuccess?: (numPages: number) => void;
  onLoadError?: (error: Error) => void;
}

export function PDFViewer({
  url,
  pageNumber = 1,
  width,
  height,
  scale = 1,
  className = '',
  onLoadSuccess,
  onLoadError,
}: PDFViewerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const isMountedRef = useRef(true);

  const options = useMemo(
    () => ({
      cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
      cMapPacked: true,
    }),
    []
  );

  useEffect(() => {
    isMountedRef.current = true;
    setLoading(true);
    setError(false);
    setIsReady(false);
    
    const timer = setTimeout(() => {
      if (isMountedRef.current) {
        setIsReady(true);
      }
    }, 50);

    return () => {
      isMountedRef.current = false;
      clearTimeout(timer);
    };
  }, [url]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    if (!isMountedRef.current) return;
    setLoading(false);
    onLoadSuccess?.(numPages);
  }

  function onDocumentLoadError(error: Error) {
    if (!isMountedRef.current) return;
    if (error.message?.includes('Worker was destroyed') || 
        error.message?.includes('sendWithPromise')) return;
    setError(true);
    setLoading(false);
    onLoadError?.(error);
  }

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-foreground/5 ${className}`}
        style={{ width, height }}
      >
        <FileText className="h-8 w-8 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-foreground/5">
          <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
        </div>
      )}
      {isReady && (
        <Document
          key={url}
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading=""
          error=""
          options={options}
        >
          <Page
            pageNumber={pageNumber}
            width={width}
            height={height}
            scale={scale}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            loading=""
            error=""
          />
        </Document>
      )}
    </div>
  );
}

// Thumbnail variant for cards
interface PDFThumbnailProps {
  url: string;
  className?: string;
}

export function PDFThumbnail({ url, className = '' }: PDFThumbnailProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-foreground/5 ${className}`}>
        <FileText className="h-8 w-8 text-muted-foreground" />
      </div>
    );
  }

  return (
    <PDFViewer
      url={url}
      pageNumber={1}
      className={className}
      scale={0.5}
      onLoadError={() => setError(true)}
    />
  );
}
