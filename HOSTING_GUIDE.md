# Hosting Guide for Murena's Students Library

## Current Status

- ✅ **GitHub Pages**: Already configured for documentation only
  - URL: `https://<username>.github.io/<repo-name>/`
  - Hosts: Static documentation files from `docs/` folder
  
- ❌ **Full Application**: Cannot run on GitHub Pages (needs Node.js backend)

## Recommended: Railway (Easiest & Free)

### Why Railway?
- ✅ Free tier with $5 credit/month
- ✅ PostgreSQL database included
- ✅ Automatic deployments from GitHub
- ✅ Simple setup
- ✅ File storage support

### Setup Steps

1. **Sign up**: Go to https://railway.app
2. **Create new project** → "Deploy from GitHub repo"
3. **Select your repository**
4. **Add PostgreSQL database**:
   - Click "New" → "Database" → "PostgreSQL"
   - Railway will provide connection string automatically
5. **Configure environment variables**:
   - `DATABASE_URL` - (auto-set by Railway)
   - `DATABASE_SSL` - Set to `true`
   - `SESSION_SECRET` - Generate a random string
   - `NODE_ENV` - Set to `production`
   - `UPLOADS_DIR` - Set to `/app/uploads` (or use Railway volumes)
6. **Deploy**:
   - Railway auto-detects Node.js
   - Set root directory: `server`
   - Build command: `npm install && npm run build`
   - Start command: `npm start`

### Update Prisma for Production

Before deploying, update `server/prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Then run migrations:
```bash
cd server
npm run prisma:migrate:deploy
```

## Alternative: Render

### Setup Steps

1. **Sign up**: https://render.com
2. **New** → **Web Service**
3. **Connect GitHub repository**
4. **Configure**:
   - **Name**: murenas-students-library
   - **Root Directory**: `server`
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. **Add PostgreSQL database**:
   - New → PostgreSQL
   - Copy connection string
6. **Set environment variables**:
   - `DATABASE_URL` - From PostgreSQL service
   - `DATABASE_SSL` - `true`
   - `SESSION_SECRET` - Random string
   - `NODE_ENV` - `production`
7. **Deploy**

## File Storage Options

Since Railway/Render have ephemeral file systems, you have options:

### Option 1: Railway Volumes (Recommended)
- Persistent storage for uploads
- Files survive redeploys
- Simple setup in Railway dashboard

### Option 2: Cloud Storage (Production)
- AWS S3
- Cloudinary (for images)
- Requires code changes to use storage SDK

### Option 3: Database Storage (Small files)
- Store files as base64 in database
- Not recommended for large files

## Quick Checklist

Before deploying:

- [ ] Update `prisma/schema.prisma` to use PostgreSQL
- [ ] Set all environment variables
- [ ] Run database migrations
- [ ] Test locally with PostgreSQL
- [ ] Configure file storage (volumes or cloud)
- [ ] Update CORS settings if needed
- [ ] Set secure `SESSION_SECRET`
- [ ] Enable SSL/HTTPS (usually automatic)

## Environment Variables Needed

```env
DATABASE_URL=postgresql://...
DATABASE_SSL=true
SESSION_SECRET=your-random-secret-here
NODE_ENV=production
UPLOADS_DIR=/app/uploads
PORT=3000  # Usually auto-set by hosting service
```

## After Deployment

1. **Run migrations**:
   ```bash
   # Via Railway CLI or Render shell
   cd server
   npm run prisma:migrate:deploy
   ```

2. **Create admin user**:
   ```bash
   npm run create:admin admin@example.com password123
   ```

3. **Test the application**:
   - Visit your deployed URL
   - Test login/registration
   - Test file uploads
   - Verify calendar display

## Cost Comparison

| Service | Free Tier | Paid Plans |
|---------|-----------|------------|
| Railway | $5 credit/month | $5-20/month |
| Render | Limited free | $7-25/month |
| Vercel | Generous free | $20+/month |
| Heroku | None | $7-25/month |

## Need Help?

- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs
- See `.github/DEPLOYMENT.md` for more details

