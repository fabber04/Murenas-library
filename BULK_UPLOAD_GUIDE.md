# Bulk Upload Guide

## Quick Start

Upload all files from a directory automatically:

```bash
cd server
npm run upload:dir /path/to/your/files
```

## Examples

### Basic Upload (All files as notes)
```bash
cd server
npm run upload:dir /home/user/documents/calendar
```

### With Custom Course ID
```bash
npm run upload:dir /path/to/files MATH101
```

### Full Options
```bash
npm run upload:dir /path/to/files MATH101 2025 exam_paper true
```

## Parameters

1. **source-directory** (required)
   - Path to directory containing files to upload
   - Example: `/home/user/documents` or `./my-files`

2. **courseId** (optional, default: `GENERAL`)
   - Course identifier
   - Example: `MATH101`, `CS201`, `GENERAL`

3. **year** (optional, default: current year)
   - Academic year
   - Example: `2025`, `2024`

4. **type** (optional, default: `notes`)
   - Material type: `notes`, `solution`, `exam_paper`, `textbook`
   - Example: `exam_paper`, `textbook`

5. **autoApprove** (optional, default: `true`)
   - Auto-approve uploads: `true` or `false`
   - If `false`, files will be pending and need admin approval

## Supported File Types

- PDF files (`.pdf`)
- Images (`.jpg`, `.jpeg`, `.png`)

**File size limit:** 25MB per file

## Examples

### Upload Calendar Documents
```bash
npm run upload:dir /path/to/calendar/files GENERAL 2025 notes true
```

### Upload Exam Papers (Pending Approval)
```bash
npm run upload:dir /path/to/exams MATH101 2025 exam_paper false
```

### Upload Textbooks
```bash
npm run upload:dir /path/to/textbooks CS201 2025 textbook true
```

## What Happens

1. Script reads all files from source directory
2. Validates file type and size
3. Copies files to `server/uploads/` directory
4. Creates database records for each file
5. Auto-approves if `autoApprove=true` (or sets to pending)

## Output

The script will show:
- ✅ Successfully uploaded files
- ⚠️  Skipped files (wrong type, too large)
- ❌ Errors
- 📊 Summary statistics

## Notes

- Files are copied (not moved) - original files stay in source directory
- File names are preserved in `originalName` field
- Unique filenames are generated to avoid conflicts
- If a file fails, others will continue processing

## Troubleshooting

**"Source directory does not exist"**
- Check the path is correct
- Use absolute paths or paths relative to `server/` directory

**"Database connection error"**
- Make sure your `.env` file has `DATABASE_URL` set
- Verify database is running

**"Table does not exist"**
- Run migrations: `npm run prisma:migrate`

## Direct Usage (without npm script)

```bash
cd server
npx tsx scripts/upload-directory.ts /path/to/files
```

