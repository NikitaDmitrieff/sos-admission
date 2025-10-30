# SOS Admissions MVP Dashboard

A modern, minimal dashboard for students and parents to access a curated library of university admission PDFs, manage profiles, and prepare for future AI-powered features.

## Features

### Current (MVP)

- **📚 Library**: Browse, filter, and preview admission PDFs
  - Grid and list view modes
  - Advanced filtering by country, level, school, and tags
  - Sort by title or date
  - PDF preview modal with metadata and related resources
  - Full-text search via Command Palette (⌘K)
  
- **👤 Profile**: Manage user information and preferences
  - Personal information (name, email)
  - Academic interests and school year
  - Theme preferences (light/dark/system)
  - Email notification settings
  - Data stored in localStorage

- **🎨 Modern UI/UX**
  - Beautiful, accessible design with shadcn/ui
  - Responsive layouts (mobile, tablet, desktop)
  - Dark mode support
  - Smooth animations and transitions
  - WCAG AA compliant

### Coming Soon (Placeholders)

- **🤖 AI Coach**: RAG-powered chat assistant for admission advice
- **📋 Processes**: Personal workspaces to track application progress

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Command Palette**: cmdk

## Project Structure

```
app/
├── layout.tsx              # Root layout with AppShell
├── page.tsx                # Home (redirects to /library)
├── library/                # PDF Library
├── profile/                # User Profile
├── ai-coach/               # AI Coach (placeholder)
└── processes/              # Processes (placeholder)

components/
├── ui/                     # shadcn components
├── shell/                  # Sidebar, Topbar, CommandPalette
├── library/                # FilterBar, BundleCard, PreviewModal
├── profile/                # ProfileCard, PreferencesCard
├── common/                 # EmptyState, Loader
└── providers/              # ThemeProvider

lib/
├── data/
│   ├── pdfs.ts            # PDF data loaders (JSON)
│   └── filters.ts         # Filter and sort utilities
├── supabase/
│   ├── client.ts          # Supabase client (placeholder)
│   └── types.ts           # Database types (placeholder)
└── utils.ts               # Utility functions

public/
└── data/
    └── pdfs.json          # PDF metadata (25 entries)
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd sos-admissions
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Data Structure

### PDF Metadata (JSON)

Currently using `public/data/pdfs.json`:

```json
{
  "id": "1",
  "title": "Complete Guide to Applying to Bocconi University",
  "school": "Bocconi University",
  "country": "Italy",
  "level": "Undergraduate",
  "tags": ["Business", "Economics", "Application Process"],
  "description": "Comprehensive guide covering...",
  "url": "/pdfs/bocconi-guide.pdf",
  "updatedAt": "2024-10-15"
}
```

### User Data (localStorage)

- **Profile**: `sos-profile` → `{ name, email }`
- **Preferences**: `sos-preferences` → `{ schoolYear, interests[], emailNotifications }`
- **Theme**: `sos-theme` → `light | dark | system`

## Migration to Supabase

When ready to migrate from JSON to Supabase:

### 1. Install Supabase

```bash
npm install @supabase/supabase-js
```

### 2. Set Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Database Schema

Create tables in Supabase:

**pdfs table:**
- id (uuid, primary key)
- title (text)
- school (text)
- country (text)
- level (text)
- tags (text[])
- description (text)
- url (text)
- updated_at (timestamptz)
- created_at (timestamptz)

**user_preferences table:**
- id (uuid, primary key)
- user_id (uuid, references auth.users)
- name (text)
- email (text)
- school_year (text)
- interests (text[])
- email_notifications (boolean)
- updated_at (timestamptz)

### 4. Supabase Storage

Set up a storage bucket for PDF files:
- Bucket name: `pdfs`
- Public access for read
- RLS policies for admin upload

### 5. Update Code

Uncomment code in `lib/supabase/client.ts` and update:
- `lib/data/pdfs.ts` - Replace JSON fetch with Supabase queries
- Profile components - Replace localStorage with Supabase queries

See inline `// TODO` comments for specific migration points.

## Accessibility

- ✅ Keyboard navigation (Tab, Enter, Escape, ⌘K)
- ✅ ARIA labels and semantic HTML
- ✅ Focus indicators
- ✅ WCAG AA color contrast
- ✅ Reduced motion support (`prefers-reduced-motion`)
- ✅ Screen reader friendly

## Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

Mobile optimizations:
- Sidebar becomes drawer
- Filter bar collapses to sheet
- Single-column PDF grid
- Touch-friendly targets (min 44x44px)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

### AI Coach
- RAG pipeline with vector embeddings
- PDF content extraction and indexing
- Chat interface with streaming responses
- Citation links to source PDFs

### Processes
- Create custom workspaces per school/program
- Link PDFs to each process
- Task management and checklists
- Deadline reminders
- Progress tracking

### Additional Features
- PDF upload for admins
- User authentication (Supabase Auth)
- Social sharing
- PDF annotations
- Collaborative features
- Analytics and insights

## Contributing

This is an MVP. For production:
1. Add authentication
2. Migrate to Supabase
3. Implement RLS policies
4. Add error boundaries
5. Set up monitoring (Sentry, etc.)
6. Add analytics
7. Optimize images and assets
8. Add E2E tests

## License

All rights reserved.

---

Built with ❤️ for students navigating university admissions.

