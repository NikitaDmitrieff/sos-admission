'use client';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
}

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && (
        <div
          className="h-12 w-12 bg-foreground/5 flex items-center justify-center mb-4"
          style={{ borderRadius: 0 }}
        >
          {icon}
        </div>
      )}
      <h3 className="text-base font-medium">{title}</h3>
      <p className="text-xs text-muted-foreground mt-0.5 max-w-md">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 h-9 px-3 text-sm bg-foreground text-background hover:bg-foreground/90 transition-all border border-foreground"
          style={{ borderRadius: 0 }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

