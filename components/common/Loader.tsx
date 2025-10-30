'use client';

export function PDFCardSkeleton() {
  return (
    <div
      className="border bg-background shadow-lg animate-pulse"
      style={{ borderRadius: 0 }}
    >
      {/* Header */}
      <div
        className="border-b px-6 py-4"
        style={{ borderRadius: 0 }}
      >
        <div
          className="aspect-video bg-foreground/5 mb-3"
          style={{ borderRadius: 0 }}
        />
        <div className="h-4 bg-foreground/5 w-3/4" style={{ borderRadius: 0 }} />
      </div>
      
      {/* Content */}
      <div className="p-6 space-y-4">
        <div className="h-3 bg-foreground/5 w-1/2" style={{ borderRadius: 0 }} />
        <div className="flex gap-2">
          <div className="h-7 bg-foreground/5 w-16" style={{ borderRadius: 0 }} />
          <div className="h-7 bg-foreground/5 w-16" style={{ borderRadius: 0 }} />
        </div>
      </div>

      {/* Footer */}
      <div
        className="border-t px-6 py-3 flex gap-2"
        style={{ borderRadius: 0 }}
      >
        <div className="flex-1 h-9 bg-foreground/5" style={{ borderRadius: 0 }} />
        <div className="h-9 w-9 bg-foreground/5" style={{ borderRadius: 0 }} />
      </div>
    </div>
  );
}

export function PDFGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <PDFCardSkeleton key={i} />
      ))}
    </div>
  );
}

