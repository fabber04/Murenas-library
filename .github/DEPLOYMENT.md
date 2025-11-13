# Deployment Guide

## GitHub Pages Configuration

### Setup Steps

1. **Enable GitHub Pages:**
   - Navigate to your repository on GitHub
   - Go to **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**
   - Save the settings

2. **Automatic Deployment:**
   - The workflow (`.github/workflows/pages.yml`) will automatically deploy documentation when you push to `main` or `master` branch
   - Documentation is built from the `docs/` folder
   - Access your site at: `https://<username>.github.io/<repository-name>/`

3. **Manual Trigger:**
   - Go to **Actions** tab
   - Select "Deploy Documentation to GitHub Pages"
   - Click "Run workflow"

## Application Deployment

The Express server cannot be hosted on GitHub Pages (static files only). Use one of these services:

### Railway
1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. Link project: `railway link`
4. Deploy: `railway up`

### Render
1. Connect your GitHub repository
2. Select "Web Service"
3. Set build command: `cd server && npm install && npm run build`
4. Set start command: `cd server && npm start`
5. Add environment variables in dashboard

### Heroku
1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create`
4. Set config vars in dashboard
5. Deploy: `git push heroku main`

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`

## Required Environment Variables

Set these in your hosting service's environment variables:

- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Strong random secret for sessions
- `DATABASE_SSL` - `true` or `false` (usually `true` for cloud databases)
- `PORT` - Server port (usually auto-set by hosting service)
- `UPLOADS_DIR` - Directory for uploads (default: `uploads`)

## GitHub Secrets (for CI/CD)

If using GitHub Actions for deployment, set these secrets:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add the following secrets:
   - `DATABASE_URL`
   - `SESSION_SECRET`
   - `DATABASE_SSL` (if needed)

## Database Setup

Before deploying, ensure your PostgreSQL database is set up:

1. Create a PostgreSQL database (local or cloud)
2. Run migrations:
   ```bash
   cd server
   npm run prisma:migrate
   ```
3. (Optional) Seed initial data

## Troubleshooting

**GitHub Pages not updating:**
- Check Actions tab for workflow errors
- Ensure `.nojekyll` file exists in root
- Verify branch is `main` or `master`

**Application deployment fails:**
- Verify all environment variables are set
- Check database connection string format
- Review build logs in hosting service dashboard
- Ensure Prisma migrations have been run

