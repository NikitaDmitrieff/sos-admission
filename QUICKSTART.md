# Quick Start Guide

## Installation

```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Features to Test

### 1. Library Page (Default)
- Browse 25 admission PDFs
- Try the filter dropdowns (Level, Country, School)
- Switch between Grid and List views
- Click "Preview" on any PDF to see the modal
- Sort by Title or Date

### 2. Command Palette
- Press `⌘K` (Mac) or `Ctrl+K` (Windows/Linux)
- Search for PDFs or navigate between pages
- Try typing "Bocconi" or "MBA"

### 3. Profile Page
- Click "Profile" in the sidebar
- Edit your name and email
- Select your school year
- Choose interests (click on the badges)
- Toggle theme (Light/Dark/System)
- Click "Save Changes" to store in localStorage

### 4. Theme Toggle
- Click the sun/moon icon in the top bar
- Theme persists across reloads

### 5. Mobile View
- Resize your browser to < 768px width
- Hamburger menu appears
- Sidebar becomes a drawer
- Grid becomes single column

### 6. Placeholder Pages
- Visit "AI Coach" and "Processes" from the sidebar
- See the coming soon designs

## Keyboard Shortcuts

- `⌘K` / `Ctrl+K` - Open command palette
- `Escape` - Close modals/command palette
- `Tab` / `Shift+Tab` - Navigate between elements

## Data Storage

All data is currently stored in:
- **PDF Metadata**: `public/data/pdfs.json` (25 entries)
- **Profile**: Browser localStorage under `sos-profile`
- **Preferences**: Browser localStorage under `sos-preferences`
- **Theme**: Browser localStorage under `sos-theme`

## Build for Production

```bash
npm run build
npm start
```

## Next Steps

See the main [README.md](./README.md) for:
- Project structure
- Migration to Supabase
- Adding real PDF files
- Implementing AI Coach and Processes

## Troubleshooting

**If you get a port conflict:**
```bash
npm run dev -- -p 3001
```

**If styles don't load:**
1. Stop the server
2. Delete `.next` folder
3. Run `npm run dev` again

**Clear localStorage:**
Open browser DevTools → Console → Run:
```javascript
localStorage.clear()
location.reload()
```

