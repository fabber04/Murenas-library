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

3) Important production changes

 - Use a production Postgres database (SQLite is not suitable for multi-instance production).
 - Provide `DATABASE_URL` env var and `SESSION_SECRET`.
 - Configure object storage (S3) for uploads and update upload handling if needed.
