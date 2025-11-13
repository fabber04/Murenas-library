# Render Quick Start Guide

## 🚀 Deploy in 5 Minutes

### Step 1: Sign Up
1. Go to https://render.com
2. Sign up with GitHub (free tier available)

### Step 2: Create Blueprint
1. Click **"New"** → **"Blueprint"**
2. Connect your GitHub account
3. Select repository: **Murenas-Students-Library**
4. Render will detect `render.yaml` automatically
5. Click **"Apply"**

### Step 3: Wait for Deployment
- Render will create:
  - ✅ Web Service (Node.js app)
  - ✅ PostgreSQL Database
  - ✅ Persistent Disk (for file uploads)
- First deployment takes 5-10 minutes

### Step 4: Verify
1. Go to your Web Service
2. Copy the URL (e.g., `https://murenas-students-library.onrender.com`)
3. Visit the URL
4. Test the application

### Step 5: Create Admin User
1. In Render dashboard → Web Service → **Shell**
2. Run:
   ```bash
   npm run create:admin admin@example.com yourpassword "Admin Name"
   ```

## ✅ That's It!

Your app is now live! 🎉

## What's Configured

- ✅ PostgreSQL database (auto-created)
- ✅ Session store (PostgreSQL)
- ✅ File uploads (persistent disk)
- ✅ Environment variables (auto-set)
- ✅ Database migrations (auto-run)
- ✅ SSL/HTTPS (automatic)

## Important URLs

- **Your App**: `https://murenas-students-library.onrender.com`
- **Dashboard**: https://dashboard.render.com
- **Logs**: Service → Logs tab

## Troubleshooting

**App won't start?**
- Check Logs tab for errors
- Verify DATABASE_URL is set
- Check build completed successfully

**Database connection fails?**
- Use "Internal Database URL" (not external)
- Verify DATABASE_SSL=true

**Files disappear?**
- Check disk is mounted correctly
- Verify UPLOADS_DIR path matches disk mount

## Next Steps

1. ✅ Test all features
2. ✅ Create admin account
3. ✅ Upload calendar
4. ✅ Configure custom domain (optional)

## Need Help?

See `RENDER_SETUP.md` for detailed instructions.

