# PDF Migration Scripts

Scripts for uploading PDFs to Supabase Storage.

## Adding New PDFs

1. **Place PDF files** in the `data_sample/` directory
2. **Add metadata** to `pdf-metadata.json`:
```json
{
  "filename": "your-file.pdf",
  "title": "Display Title",
  "school": "School Name",
  "country": "Country",
  "level": "Undergraduate",
  "tags": ["Tag1", "Tag2"],
  "description": "Description text"
}
```
3. **Run migration**: `npm run migrate:pdfs`

## Requirements

Ensure your `.env.local` contains:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Notes

- PDFs are automatically sanitized (accents removed, special chars replaced)
- Each file gets a timestamp prefix to prevent collisions
- The script will report success/failure for each upload

