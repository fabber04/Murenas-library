# Upload Functionality Setup Guide

## Current Status

The upload code is already implemented, but you need to complete these steps to make it work:

## ✅ What's Already Done

- ✅ Upload route configured (`/materials/submissions`)
- ✅ Multer file upload middleware set up
- ✅ File validation (PDF, PNG, JPG, max 25MB)
- ✅ Database model exists (`MaterialSubmission`)
- ✅ Upload form exists (`/materials/submit`)

## 🔧 What Needs to Be Done

### 1. Run Database Migrations

The `MaterialSubmission` table needs to exist in your PostgreSQL database.

```bash
cd server
npm run prisma:migrate
```

Or if you haven't created migrations yet:
```bash
cd server
npx prisma migrate dev --name add_material_submissions
```

**Check if it worked:**
```bash
npx prisma studio
# Opens a browser - check if MaterialSubmission table exists
```

### 2. Serve Uploaded Files (IMPORTANT)

Currently, files are uploaded but can't be accessed. Add this to `server/src/index.ts`:

**After line 143** (after `app.use(express.static(...))`), add:

```typescript
// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));
```

This allows uploaded files to be accessed at: `http://localhost:4000/uploads/filename.pdf`

### 3. Verify Upload Directory

The uploads directory should be created automatically, but verify:

```bash
cd server
ls -la uploads/
```

If it doesn't exist or is empty, that's fine - it will be created on first upload.

### 4. Test the Upload

1. **Start your server:**
   ```bash
   cd server
   npm run build
   npm start
   ```

2. **Visit the upload page:**
   ```
   http://localhost:4000/materials/submit
   ```

3. **Fill out the form:**
   - Title: "Test Upload"
   - Course ID: "TEST101"
   - Year: 2025
   - Type: Notes
   - File: Choose a PDF or image

4. **Submit and check:**
   - Should redirect to success page
   - Check `server/uploads/` folder - file should be there
   - Check database - record should be in `MaterialSubmission` table

### 5. Database Connection Check

Make sure your `.env` file has:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/database
SESSION_SECRET=your-secret-key
```

### 6. Common Issues & Fixes

#### Issue: "Failed to save submission"
- **Cause**: Database connection or table doesn't exist
- **Fix**: Run migrations (step 1)

#### Issue: "Please select a file to upload"
- **Cause**: File not being received
- **Fix**: Check form has `enctype="multipart/form-data"` (already done)

#### Issue: "CAPTCHA verification failed"
- **Cause**: CAPTCHA is enabled but not configured
- **Fix**: Either:
  - Set `ANONYMOUS_UPLOADS_ENABLED=false` in `.env` (disables CAPTCHA)
  - Or configure `CAPTCHA_PROVIDER` and `CAPTCHA_SECRET_KEY`

#### Issue: Files upload but can't be viewed/downloaded
- **Cause**: Static file serving not configured
- **Fix**: Add step 2 above

#### Issue: "ENOENT: no such file or directory" (uploads folder)
- **Cause**: Directory doesn't exist
- **Fix**: The code creates it automatically, but you can manually create:
  ```bash
  mkdir -p server/uploads
  ```

### 7. For Production Deployment

When deploying to Railway/Render/etc:

1. **Uploads directory**: 
   - Local: Files stored in `server/uploads/`
   - Production: Consider using cloud storage (S3, Cloudinary) for persistence
   - Or use a persistent volume if your host supports it

2. **File serving**:
   - The static file serving will work, but files will be lost on redeploy
   - **Better solution**: Use cloud storage (see below)

3. **Environment variables**:
   - Set `UPLOADS_DIR` if you want a custom path
   - Set `DATABASE_URL` (required)
   - Set `SESSION_SECRET` (required)

## 🚀 Optional: Cloud Storage (Recommended for Production)

For production, consider using cloud storage instead of local files:

### Option 1: AWS S3
- More reliable
- Files persist across deployments
- Better for scaling

### Option 2: Cloudinary
- Easy setup
- Image optimization included
- Free tier available

### Option 3: Railway/Render Volumes
- Persistent storage
- Files survive redeploys
- Simpler than cloud storage

## Quick Test Checklist

- [ ] Database migrations run successfully
- [ ] `MaterialSubmission` table exists in database
- [ ] Uploads directory exists (or will be created)
- [ ] Static file serving added to `index.ts`
- [ ] Server starts without errors
- [ ] Can access `/materials/submit` page
- [ ] Can upload a test file
- [ ] File appears in `server/uploads/` folder
- [ ] Record appears in database
- [ ] Can access uploaded file via URL

## Next Steps After Upload Works

1. **Admin approval workflow**: Set up admin dashboard to approve/reject uploads
2. **File viewing**: Add routes to view/download approved materials
3. **Search functionality**: Implement search for approved materials
4. **User uploads page**: Show user's own submissions

