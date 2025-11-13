# Quick Deployment Guide

## Understanding the Two Sites

1. **GitHub Pages** (https://fabber04.github.io/Murenas-library/)
   - ✅ Currently working - Shows documentation only
   - ❌ Cannot run the Express server
   - Purpose: Documentation and project info

2. **Web Application** (Needs separate hosting)
   - ✅ Full Express server with EJS templates
   - ✅ Database, authentication, file uploads
   - ❌ Cannot run on GitHub Pages
   - **You need to deploy this separately**

## Free Hosting Options for the Web App

### Option 1: Railway (Recommended - Easiest)

1. **Sign up**: Go to [railway.app](https://railway.app) and sign up with GitHub
2. **Create project**: Click "New Project" → "Deploy from GitHub repo"
3. **Select repository**: Choose `Murenas-library`
4. **Configure**:
   - Root directory: `server`
   - Build command: `npm install && npm run build`
   - Start command: `npm start`
5. **Add PostgreSQL**:
   - Click "+ New" → "Database" → "PostgreSQL"
   - Railway automatically sets `DATABASE_URL`
6. **Set environment variables**:
   - `SESSION_SECRET` - Generate a random string
   - `DATABASE_SSL` - Set to `true`
7. **Deploy**: Railway auto-deploys on every push!

**Your app will be live at**: `https://your-app-name.up.railway.app`

### Option 2: Render

1. **Sign up**: Go to [render.com](https://render.com) and sign up
2. **Create Web Service**:
   - Connect your GitHub repository
   - Name: `murenas-library`
   - Root Directory: `server`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
3. **Add PostgreSQL Database**:
   - Click "New" → "PostgreSQL"
   - Copy the connection string
4. **Set environment variables**:
   - `DATABASE_URL` - From PostgreSQL service
   - `SESSION_SECRET` - Random string
   - `DATABASE_SSL` - `true`
5. **Deploy**: Click "Create Web Service"

**Your app will be live at**: `https://murenas-library.onrender.com`

### Option 3: Fly.io

1. **Install Fly CLI**: `curl -L https://fly.io/install.sh | sh`
2. **Login**: `fly auth login`
3. **Create app**: `fly launch` (in the `server` directory)
4. **Set secrets**:
   ```bash
   fly secrets set DATABASE_URL="your-postgres-url"
   fly secrets set SESSION_SECRET="your-secret"
   fly secrets set DATABASE_SSL="true"
   ```
5. **Deploy**: `fly deploy`

## Required Setup Before Deployment

### 1. Set up PostgreSQL Database

**Free options:**
- **Railway**: Includes free PostgreSQL (500MB)
- **Render**: Free PostgreSQL (90 days, then $7/month)
- **Supabase**: Free tier (500MB)
- **Neon**: Free tier (0.5GB)

### 2. Run Database Migrations

After setting up PostgreSQL, run migrations:

```bash
cd server
DATABASE_URL="your-postgres-url" npm run prisma:migrate
```

### 3. Environment Variables Needed

```env
DATABASE_URL=postgresql://user:password@host:port/database
SESSION_SECRET=your-random-secret-key-here
DATABASE_SSL=true
PORT=4000
UPLOADS_DIR=uploads
```

## Quick Test Locally

Before deploying, test with a real PostgreSQL database:

```bash
cd server
# Set DATABASE_URL in .env file
npm run prisma:migrate
npm run build
npm start
```

## What Gets Deployed Where

| Component | GitHub Pages | Hosting Service |
|-----------|-------------|-----------------|
| Documentation | ✅ Yes | ❌ No |
| Express Server | ❌ No | ✅ Yes |
| Database | ❌ No | ✅ Yes (PostgreSQL) |
| File Uploads | ❌ No | ✅ Yes |
| Authentication | ❌ No | ✅ Yes |

## Next Steps

1. Choose a hosting service (Railway recommended for simplicity)
2. Set up PostgreSQL database
3. Configure environment variables
4. Deploy!
5. Update your README with the live app URL

## Need Help?

- Railway docs: https://docs.railway.app
- Render docs: https://render.com/docs
- Fly.io docs: https://fly.io/docs

