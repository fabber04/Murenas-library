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

2. Set up database (first time only):
   ```bash
   cd server
   DATABASE_URL="file:./dev.db" npx prisma generate
   DATABASE_URL="file:./dev.db" npx prisma migrate dev
   ```

### Start the Server

The application uses server-side rendering (EJS templates), so you only need to run one command:

```bash
cd server
npm run build
DATABASE_URL="file:./dev.db" node dist/index.js
```

Or in one line:
```bash
cd server && npm run build && DATABASE_URL="file:./dev.db" node dist/index.js
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
DATABASE_URL="file:./dev.db" npm run dev
```

Note: The `dev` script uses `ts-node-dev` which may have issues with the project path containing special characters. If you encounter errors, use the build + run approach above.

### Environment Variables

Create a `.env` file in the `server/` directory (optional):
```
PORT=4000
DATABASE_URL=file:./dev.db
UPLOADS_DIR=uploads
ANONYMOUS_UPLOADS_ENABLED=true
CAPTCHA_PROVIDER=
CAPTCHA_SECRET_KEY=
```

### Troubleshooting

**Port 4000 already in use:**
```bash
# Find and kill the process
lsof -ti:4000 | xargs kill -9

# Or use a different port
PORT=4001 DATABASE_URL="file:./dev.db" node dist/index.js
```

Configuration Flags
-------------------
- `ANONYMOUS_UPLOADS_ENABLED` (default: true) — allow public uploads to submissions queue.
- `CAPTCHA_PROVIDER` — e.g., reCAPTCHA hCaptcha; required if anonymous uploads enabled.

License
-------
TBD.


