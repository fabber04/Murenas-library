Deployment notes — Murena's Students Library

This document contains quick steps to run and deploy the server in production.

1) Build and run with Docker (local)

  # build image from repo root
  docker build -t murenas-library-server ./server

  # run container (example using Postgres)
  docker run -p 4000:4000 \
    -e DATABASE_URL="postgres://USER:PASS@HOST:PORT/DB" \
    -e SESSION_SECRET="your-session-secret" \
    -e NODE_ENV=production \
    murenas-library-server

2) Recommended hosting

 - Render / Railway / Fly: connect this repository and configure the service to deploy the server container or deploy from the built image.

Render-specific quick start
 - Connect this GitHub repository to Render (https://dashboard.render.com/new)
 - Choose "Web Service" and set the environment to "Docker"
 - Set the Dockerfile path to: `server/Dockerfile` and branch `main`
 - Add the following environment variables in Render's dashboard (Settings → Environment):
   - DATABASE_URL (Postgres connection string)
   - SESSION_SECRET (a long random value)
   - NODE_ENV=production
 - If you want CI to trigger deploys automatically, add these GitHub repository secrets:
   - RENDER_API_KEY — a Render API key (create in Render dashboard under Account → API Keys)
   - RENDER_SERVICE_ID — the numeric/alphanumeric service id for your Render Web Service
 - The repo includes `.github/workflows/render-deploy.yml` which will call the Render deploy API on pushes to `main` when the above secrets are configured.

Notes about production readiness
 - Ensure you provision a Postgres instance (Render offers Postgres databases) and set `DATABASE_URL` accordingly.
 - Run `npx prisma migrate deploy` against the provisioned database as part of your deploy step (can be added to CI).
 - Replace local file uploads with object storage (S3/Buckets) for persistence across instances.


3) Important production changes

 - Use a production Postgres database (SQLite is not suitable for multi-instance production).
 - Provide `DATABASE_URL` env var and `SESSION_SECRET`.
 - Configure object storage (S3) for uploads and update upload handling if needed.
