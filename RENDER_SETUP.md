# Render Deployment Guide

Step-by-step guide to deploy Murena's Students Library to Render.

## Prerequisites

- GitHub account with your repository
- Render account (sign up at https://render.com - free tier available)

## Step 1: Prepare Your Repository

✅ Already done:
- Prisma schema set to PostgreSQL
- `render.yaml` configuration file created
- Build and start scripts configured

## Step 2: Create Render Account & Connect Repository

1. **Sign up**: Go to https://render.com and sign up (free tier available)

2. **Connect GitHub**:
   - Go to Dashboard
   - Click "New" → "Blueprint"
   - Connect your GitHub account
   - Select your repository: `Murenas-Students-Library`
   - Render will detect `render.yaml` automatically

## Step 3: Configure Services

Render will create services based on `render.yaml`:

### Web Service
- **Name**: murenas-students-library
- **Environment**: Node
- **Root Directory**: `server` (set in Render dashboard)
- **Build Command**: `npm install && npm run prisma:generate && npm run build`
- **Start Command**: `npm run prisma:migrate:deploy && npm start`

### PostgreSQL Database
- **Name**: murenas-library-db
- **Plan**: Starter (free tier)
- **Database Name**: murenas_library
- **User**: murenas_user

## Step 4: Set Environment Variables

In Render dashboard, go to your Web Service → Environment:

### Required Variables:

1. **DATABASE_URL**
   - Go to your PostgreSQL service
   - Copy the "Internal Database URL"
   - Format: `postgresql://user:password@host:port/database?sslmode=require`
   - Paste into Web Service environment variables

2. **DATABASE_SSL**
   - Value: `true`

3. **SESSION_SECRET**
   - Generate a random string: `openssl rand -base64 32`
   - Or Render will auto-generate if using `generateValue: true`

4. **NODE_ENV**
   - Value: `production`

5. **PORT**
   - Value: `10000` (Render sets this automatically, but good to have)

6. **UPLOADS_DIR**
   - Value: `/opt/render/project/src/server/uploads`
   - Or use Render disk mount path

## Step 5: Configure Persistent Disk (for file uploads)

1. In your Web Service settings:
   - Go to "Disks" section
   - Add disk:
     - **Name**: uploads-disk
     - **Mount Path**: `/opt/render/project/src/server/uploads`
     - **Size**: 1GB (or more if needed)

2. Update `UPLOADS_DIR` environment variable to match mount path

## Step 6: Deploy

1. **Manual Deploy**:
   - Click "Manual Deploy" → "Deploy latest commit"
   - Watch the build logs

2. **Automatic Deploy**:
   - Render auto-deploys on every push to `main` branch
   - Configure in service settings → "Auto-Deploy"

## Step 7: Run Database Migrations

After first deployment:

1. Go to your Web Service
2. Click "Shell" (or use Render CLI)
3. Run:
   ```bash
   cd server
   npm run prisma:migrate:deploy
   ```

Or migrations will run automatically if `startCommand` includes it (already configured).

## Step 8: Create Admin User

1. Open Shell in Render dashboard
2. Run:
   ```bash
   cd server
   npm run create:admin admin@example.com yourpassword "Admin Name"
   ```

## Step 9: Verify Deployment

1. **Check logs**: Service → Logs
2. **Visit URL**: `https://your-service-name.onrender.com`
3. **Test features**:
   - Home page loads
   - Registration works
   - Login works
   - File upload works
   - Calendar displays

## Troubleshooting

### Build Fails

**Error**: "Cannot find module"
- **Fix**: Make sure `Root Directory` is set to `server` in Render dashboard

**Error**: Prisma client not generated
- **Fix**: Build command should include `npm run prisma:generate`

### Database Connection Fails

**Error**: "Can't reach database server"
- **Fix**: 
  - Use "Internal Database URL" (not external)
  - Check `DATABASE_SSL=true`
  - Verify database is running

### File Uploads Don't Work

**Error**: Files disappear after redeploy
- **Fix**: 
  - Use Render persistent disk (configured in render.yaml)
  - Or migrate to cloud storage (S3, Cloudinary)

### Session Issues

**Error**: Sessions not persisting
- **Fix**: 
  - Verify `SESSION_SECRET` is set
  - Check PostgreSQL session table exists
  - Verify `connect-pg-simple` is installed

## Environment Variables Checklist

Before deploying, ensure these are set:

- [ ] `DATABASE_URL` - From PostgreSQL service (Internal URL)
- [ ] `DATABASE_SSL` - `true`
- [ ] `SESSION_SECRET` - Random string
- [ ] `NODE_ENV` - `production`
- [ ] `PORT` - `10000` (or auto-set by Render)
- [ ] `UPLOADS_DIR` - Disk mount path

## Render Free Tier Limits

- **Web Services**: 750 hours/month (enough for 24/7 on one service)
- **PostgreSQL**: 90 days retention, 1GB storage
- **Disk**: 512MB free (upgrade for more)
- **Sleep**: Free services sleep after 15 min inactivity

## Upgrade to Paid (Optional)

If you need:
- No sleep (always on)
- More disk space
- More database storage
- Better performance

Upgrade to Starter plan ($7/month) or higher.

## Quick Reference

**Service URL**: `https://murenas-students-library.onrender.com`  
**Dashboard**: https://dashboard.render.com  
**Docs**: https://render.com/docs

## Next Steps After Deployment

1. ✅ Test all features
2. ✅ Create admin account
3. ✅ Upload calendar document
4. ✅ Configure custom domain (optional)
5. ✅ Set up monitoring/alerts
6. ✅ Backup database regularly

## Need Help?

- Render Docs: https://render.com/docs
- Render Support: support@render.com
- Check service logs for errors

