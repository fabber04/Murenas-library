import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import SQLiteStore from 'connect-sqlite3';
import pg from 'pg';
import connectPgSimple from 'connect-pg-simple';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import crypto from 'crypto';
import { materialsRouter } from './routes/materials.js';
import { authRouter } from './routes/auth.js';
import { adminRouter } from './routes/admin.js';
import { prisma } from './db/prisma.js';
import { AuthRequest } from './middleware/auth.js';

const app = express();

const executiveCouncil = [
  {
    name: 'Stacey Majuru',
    position: 'President',
    photoUrl: '/images/src/1.jpeg',
    contact: 'president.src@nust.ac.zw'
  },
  {
    name: 'Kudzai Zhuwaki',
    position: 'Vice President',
    photoUrl: '/images/src/2.jpeg',
    contact: 'vicepresident.src@nust.ac.zw'
  },
  {
    name: 'Tinotenda J. Kademeteme',
    position: 'Secretary General',
    photoUrl: '/images/src/3.jpeg',
    contact: 'secretary.src@nust.ac.zw'
  },
  {
    name: 'Tamia H. S. Moyo',
    position: 'Treasurer General',
    photoUrl: '/images/src/4.jpeg',
    contact: 'treasurer.src@nust.ac.zw'
  }
];

const ministerialCouncil = [
  {
    name: 'Matthias T. Nyamande',
    position: 'Academic Affairs',
    photoUrl: '/images/src/5.jpeg'
  },
  {
    name: 'Blessed Shawn Charlie',
    position: 'Entertainment',
    photoUrl: '/images/src/6.jpeg'
  },
  {
    name: 'Tinotenda Nyamadzawo',
    position: 'Entertainment',
    photoUrl: '/images/src/7.jpeg'
  },
  {
    name: 'Sithatshisiwe A. Ncube',
    position: 'Clubs and Societies',
    photoUrl: '/images/src/8.jpeg'
  },
  {
    name: 'Brighton Samutamvu',
    position: 'Clubs and Societies',
    photoUrl: '/images/src/9.jpeg'
  },
  {
    name: 'Felicia Madeyi',
    position: 'Food, Health and Student Welfare',
    photoUrl: '/images/src/10.jpeg'
  },
  {
    name: 'Panashe Divine Karidzagundi',
    position: 'Information and Publicity',
    photoUrl: '/images/src/11.jpeg'
  },
  {
    name: 'Learnmore Ngirandi',
    position: 'Legal and Constitutional Affairs',
    photoUrl: '/images/src/12.jpeg'
  },
  {
    name: 'Nyasha Paundi',
    position: 'Resident and Non Resident Students',
    photoUrl: '/images/src/13.jpeg'
  },
  {
    name: 'Presley Chadenga',
    position: 'Sports and Recreation',
    photoUrl: null
  },
  {
    name: 'Thembani Godwill Nyoni',
    position: 'Sports and Recreation',
    photoUrl: null
  }
];

// Session store configuration - use PostgreSQL if DATABASE_URL is PostgreSQL, otherwise SQLite
const isPostgres = process.env.DATABASE_URL?.startsWith('postgresql://') || process.env.DATABASE_URL?.startsWith('postgres://');

let sessionStore: any;

if (isPostgres) {
  // PostgreSQL session store for production (Render, Railway, etc.)
  const PgSession = connectPgSimple(session);
  const pgPool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined
  });
  sessionStore = new PgSession({
    pool: pgPool,
    tableName: 'user_sessions',
    createTableIfMissing: true
  });
} else {
  // SQLite session store for local development
  const SQLiteStoreSession = SQLiteStore(session);
  sessionStore = new (SQLiteStoreSession as any)({
    db: 'sessions.db',
    dir: path.join(process.cwd(), 'data'),
    table: 'session'
  });
}

app.use(session({
  store: sessionStore,
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  }
}));

app.use(helmet({
  contentSecurityPolicy: false // Allow inline scripts for EJS
}));
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.set('views', path.join(process.cwd(), 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), 'public')));

// Make user available to all views
app.use((req: AuthRequest, res, next) => {
  res.locals.user = req.session?.user || null;
  next();
});

const uploadsDir = process.env.UPLOADS_DIR || path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

const upload = multer({
  dest: uploadsDir,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['application/pdf', 'image/png', 'image/jpeg'];
    cb(null, allowed.includes(file.mimetype));
  }
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Simple search redirect: searches across materials/announcements/contacts
app.get('/search', (req, res) => {
  const q = String(req.query.q || '').trim();
  if (!q) {
    return res.redirect('/');
  }
  // For now, redirect to materials listing with query param. Later: implement multi-index search.
  return res.redirect('/materials?query=' + encodeURIComponent(q));
});

// Frontend routes
app.get('/', (_req, res) => {
  res.render('home', { title: 'Home' });
});

app.get('/academics', (_req, res) => {
  res.render('academics', { title: 'Academics' });
});

app.get('/academics/calendar', async (_req, res) => {
  try {
    // Find approved calendar document first, then pending if none approved
    let calendarDoc = await prisma.materialSubmission.findFirst({
      where: {
        OR: [
          { title: { contains: 'revised calendar' } },
          { title: { contains: 'calendar' } }
        ],
        status: 'approved'
      },
      orderBy: { createdAt: 'desc' }
    });

    // If no approved calendar found, get the most recent one (even if pending)
    if (!calendarDoc) {
      calendarDoc = await prisma.materialSubmission.findFirst({
        where: {
          OR: [
            { title: { contains: 'revised calendar' } },
            { title: { contains: 'calendar' } }
          ]
        },
        orderBy: { createdAt: 'desc' }
      });
    }

    res.render('academics-calendar', { 
      title: 'Academic Calendar',
      calendarDoc: calendarDoc ? {
        title: calendarDoc.title,
        fileName: path.basename(calendarDoc.filePath),
        originalName: calendarDoc.originalName,
        createdAt: calendarDoc.createdAt
      } : null
    });
  } catch (error) {
    console.error('Error fetching calendar:', error);
    res.render('academics-calendar', { 
      title: 'Academic Calendar',
      calendarDoc: null
    });
  }
});

app.get('/academics/exams', (_req, res) => {
  res.render('academics-exams', { title: 'Exam Timetable' });
});

app.get('/academics/notices', (_req, res) => {
  res.render('academics-notices', { title: 'Registration Notices' });
});

app.get('/academics/src', (_req, res) => {
  const members = [...executiveCouncil, ...ministerialCouncil];
  res.render('academics-src', {
    title: 'Student Representative Council',
    topMembers: members.slice(0, 3),
    ministerMembers: members.slice(3)
  });
});

app.get('/materials', async (req, res) => {
  try {
    const query = (req.query.query as string) || '';
    const type = (req.query.type as string) || '';
    const year = req.query.year ? parseInt(req.query.year as string) : null;

    // Build where clause for filtering
    const where: any = {
      status: 'approved' // Only show approved materials
    };

    if (query) {
      where.title = { contains: query };
    }

    if (type) {
      where.type = type;
    }

    if (year) {
      where.year = year;
    }

    const materials = await prisma.materialSubmission.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100 // Limit to 100 results
    });

    res.render('materials', { 
      title: 'Exam Materials',
      materials,
      query: query || '',
      type: type || '',
      year: year || ''
    });
  } catch (error) {
    console.error('Error fetching materials:', error);
    res.render('materials', { 
      title: 'Exam Materials',
      materials: [],
      query: '',
      type: '',
      year: '',
      error: 'Failed to load materials'
    });
  }
});

app.get('/materials/submit', (req, res) => {
  res.render('upload', { 
    title: 'Submit Study Material',
    success: req.query.success ? decodeURIComponent(req.query.success as string) : undefined,
    error: req.query.error ? decodeURIComponent(req.query.error as string) : undefined
  });
});

app.get('/info', (_req, res) => {
  res.render('info', { title: 'Information' });
});

app.get('/info/enquiry', (_req, res) => {
  res.render('info-enquiry', { title: 'Enquiry Desk' });
});

app.get('/info/updates', (_req, res) => {
  res.render('info-updates', { title: 'Updates & Announcements' });
});

app.get('/info/venues', (_req, res) => {
  res.render('info-venues', { title: 'Venues Directory' });
});

app.get('/sports', (_req, res) => {
  res.render('sports', { title: 'Sports' });
});

app.get('/sports/venues', (_req, res) => {
  res.render('sports-venues', { title: 'Sports Venues' });
});

app.get('/sports/contacts', (_req, res) => {
  res.render('sports-contacts', { title: 'Coaches & Captains' });
});

app.get('/sports/competitions', (_req, res) => {
  res.render('sports-competitions', { title: 'Competitions' });
});

app.get('/security/report', (req, res) => {
  res.render('security-report', { 
    title: 'Report Security Incident',
    success: req.query.success ? decodeURIComponent(req.query.success as string) : undefined,
    error: req.query.error ? decodeURIComponent(req.query.error as string) : undefined
  });
});

app.post('/security/reports', upload.single('attachment'), async (req: AuthRequest, res) => {
  try {
    const { kind, description, location_text, reporter_contact } = req.body;
    
    if (!kind || !description) {
      return res.redirect('/security/report?error=' + encodeURIComponent('Please fill in all required fields.'));
    }

    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '';
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex');
    const ticketId = crypto.randomUUID().substring(0, 8).toUpperCase();

    // Save to database
    await prisma.securityReport.create({
      data: {
        userId: req.session?.user?.id || null,
        kind,
        description,
        location: location_text || null,
        contactEmail: reporter_contact || null,
        attachmentPath: req.file?.path || null,
        ticketId,
        ipHash,
        status: 'pending'
      }
    });
    
    return res.redirect('/security/report?success=' + encodeURIComponent(`Report submitted successfully! Your ticket ID: ${ticketId}. Security will review your report.`));
  } catch (error) {
    console.error('Security report error:', error);
    return res.redirect('/security/report?error=' + encodeURIComponent('Failed to submit report. Please try again.'));
  }
});

// Auth routes
app.use('/', authRouter());

// API routes
app.use('/materials', materialsRouter({ uploadsDir }));

// Admin routes (placeholder views)
app.use('/admin', adminRouter());

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${port}`);
});


