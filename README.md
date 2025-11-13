Murena's Students Library
=========================

Overview
--------
Murena's Students Library is a web application for students to access academic materials, campus information, report security incidents, and follow sports activities. This README gives a high-level overview and links to deeper docs in `docs/`.

Core Sections (from project sketch)
-----------------------------------
- **Academics**: Calendar, Exams Timetable, Registration Notices, Current SRC
- **Information**: Enquiry Desk, Updates/Announcements, Venues
- **Exam Material**: Text Books, Notes, Exam Papers, Solutions
- **Security**: Report Abuse, Report Theft
- **Sports**: Venues, Coach Contacts, Captain Contacts, Competition Dates

MVP Goals
---------
- Public-facing pages for all sections above
- Admin dashboard to manage content, contacts, venues, and review security reports
- Upload and serve study materials (PDF/images), with metadata and search
- Basic auth for admins; students access content without login

Status
------
Documentation scaffolding. See `docs/` for specifications and roadmap.

Docs
----
- `docs/requirements.md` — product requirements and user stories
- `docs/data-model.md` — entities and relationships
- `docs/api.md` — API specification
- `docs/ia-sitemap.md` — information architecture and page map
- `docs/roles-permissions.md` — roles, permissions, and admin workflows
- `docs/roadmap.md` — milestones and deliverables
- `docs/contributing.md` — contribution guidelines

Stack (to confirm)
------------------
This project is stack-agnostic at the spec level. Suggested options:
- Next.js (App Router) + Node/NestJS + PostgreSQL
- or Django + DRF + PostgreSQL

Getting Started
---------------
Implementation pending. Once stack is selected, this section will include setup, environment variables, database, and run commands.

Running the Application
-----------------------

### Prerequisites
- Node.js (v18 or higher)
- npm

### Setup
1. Install dependencies:
   ```bash
   cd server
   npm install
   ```

2. Set up database (PostgreSQL required):
   ```bash
   cd server
   # Set DATABASE_URL in .env file (see Environment Variables section)
   npm run prisma:generate
   npm run prisma:migrate
   ```

### Start the Server

The application uses server-side rendering (EJS templates), so you only need to run one command:

```bash
cd server
npm run build
npm start
```

Or in one line:
```bash
cd server && npm run build && npm start
```

The server will start on **http://localhost:4000**

### Access the Application

Open your browser and go to:
- **Home**: http://localhost:4000/
- **Health Check**: http://localhost:4000/health

### Development Mode (Auto-reload)

For development with auto-reload on file changes:
```bash
cd server
npm run dev
```

Note: Make sure your `.env` file is configured with `DATABASE_URL` before running. The `dev` script uses `ts-node-dev` which may have issues with the project path containing special characters. If you encounter errors, use the build + run approach above.

### Environment Variables

Create a `.env` file in the `server/` directory:
```
PORT=4000
DATABASE_URL=postgresql://user:password@localhost:5432/murenas_library
DATABASE_SSL=false
SESSION_SECRET=your-secret-key-change-in-production
UPLOADS_DIR=uploads
ANONYMOUS_UPLOADS_ENABLED=true
CAPTCHA_PROVIDER=
CAPTCHA_SECRET_KEY=
```

**Required:**
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Secret key for session encryption (use a strong random string)

**Optional:**
- `DATABASE_SSL` - Set to `true` if using a cloud database with SSL
- `PORT` - Server port (default: 4000)
- `UPLOADS_DIR` - Directory for uploaded files (default: `uploads`)

### Troubleshooting

**Port 4000 already in use:**
```bash
# Find and kill the process
lsof -ti:4000 | xargs kill -9

# Or use a different port
PORT=4001 npm start
```

Configuration Flags
-------------------
- `ANONYMOUS_UPLOADS_ENABLED` (default: true) — allow public uploads to submissions queue.
- `CAPTCHA_PROVIDER` — e.g., reCAPTCHA hCaptcha; required if anonymous uploads enabled.

GitHub Pages & Deployment
--------------------------

### ⚠️ Important: Two Different Sites

**GitHub Pages** (currently live):
- ✅ Shows **documentation only** (`docs/` folder)
- ❌ **Cannot run the Express server** (GitHub Pages only serves static files)
- URL: `https://fabber04.github.io/Murenas-library/`

**Web Application** (needs separate hosting):
- ✅ Full Express server with database, authentication, file uploads
- ❌ **Cannot run on GitHub Pages** - needs Node.js hosting (Railway, Render, etc.)
- See `DEPLOYMENT_QUICK_START.md` for deployment instructions

### Documentation Site (GitHub Pages)

Documentation is automatically deployed to GitHub Pages when changes are pushed to the `main` or `master` branch.

**To enable GitHub Pages:**
1. Go to your repository Settings → Pages
2. Under "Source", select "GitHub Actions"
3. The workflow (`.github/workflows/pages.yml`) will automatically build and deploy documentation from the `docs/` folder

**Access your documentation:**
- URL: `https://fabber04.github.io/Murenas-library/`

### Continuous Integration

GitHub Actions workflows are configured for:
- **CI** (`.github/workflows/ci.yml`): Runs tests and builds on every push/PR
- **Pages** (`.github/workflows/pages.yml`): Deploys documentation to GitHub Pages
- **Deploy** (`.github/workflows/deploy.yml`): Template for application deployment

### Deployment Setup

To deploy the application to a hosting service:

1. **Set GitHub Secrets:**
   - Go to repository Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `DATABASE_URL` - Your PostgreSQL connection string
     - `SESSION_SECRET` - A strong random secret for sessions

2. **Configure Deployment:**
   - Edit `.github/workflows/deploy.yml`
   - Add your deployment commands (Railway, Render, Heroku, Vercel, etc.)

**Example deployment services:**
- **Railway**: `railway up`
- **Render**: `render deploy`
- **Heroku**: `git push heroku main`
- **Vercel**: `vercel --prod`

**Note:** The Express server requires a Node.js hosting environment. GitHub Pages only serves static files, so it cannot host the application itself.

License
-------
TBD.


