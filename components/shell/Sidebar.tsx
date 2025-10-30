'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  User,
  MessageSquare,
  FolderKanban,
  Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const navItems = [
  {
    title: 'Library',
    href: '/library',
    icon: BookOpen,
    badge: null,
  },
  {
    title: 'Profile',
    href: '/profile',
    icon: User,
    badge: null,
  },
  {
    title: 'AI Coach',
    href: '/ai-coach',
    icon: MessageSquare,
    badge: 'Soon',
  },
  {
    title: 'Processes',
    href: '/processes',
    icon: FolderKanban,
    badge: 'Soon',
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'flex flex-col w-64 border-r bg-card h-screen sticky top-0',
        className
      )}
    >
      <div className="p-6">
        <Link href="/library" className="flex items-center gap-2 group">
          <Sparkles className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">SOS</span>
        </Link>
      </div>

      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                    item.badge && !isActive && 'opacity-60'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="flex-1">{item.title}</span>
                  {item.badge && (
                    <Badge
                      variant={isActive ? 'secondary' : 'outline'}
                      className="text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t">
        <p className="text-xs text-muted-foreground text-center">
          SOS Admissions © 2024
        </p>
      </div>
    </aside>
  );
}

