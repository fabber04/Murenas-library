import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import SQLiteStore from 'connect-sqlite3';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import crypto from 'crypto';
import { materialsRouter } from './routes/materials.js';
import { authRouter } from './routes/auth.js';
import { adminRouter } from './routes/admin.js';
import { prisma } from './db/prisma.js';
const app = express();
// Session configuration
const SQLiteStoreSession = SQLiteStore(session);
app.use(session({
    store: new SQLiteStoreSession({
        db: 'sessions.db',
        dir: './data'
    }),
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
app.use((req, res, next) => {
    res.locals.user = req.session?.user || null;
    next();
});
const uploadsDir = process.env.UPLOADS_DIR || path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
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
app.get('/academics/calendar', (_req, res) => {
    res.render('academics-calendar', { title: 'Academic Calendar' });
});
app.get('/academics/exams', (_req, res) => {
    res.render('academics-exams', { title: 'Exam Timetable' });
});
app.get('/academics/notices', (_req, res) => {
    res.render('academics-notices', { title: 'Registration Notices' });
});
app.get('/academics/src', (_req, res) => {
    // Sample SRC members - replace with DB-backed data when available
    const members = [
        { name: 'Asha Mwangi', position: 'President', photoUrl: null, contact: 'asha.mwangi@example.edu' },
        { name: 'Samuel Osei', position: 'Vice President', photoUrl: null, contact: 'samuel.osei@example.edu' },
        { name: 'Lilian Kim', position: 'Secretary', photoUrl: null, contact: 'lilian.kim@example.edu' },
        { name: 'Peter Adu', position: 'Treasurer', photoUrl: null, contact: 'peter.adu@example.edu' },
        { name: 'Nora Mensah', position: 'Social Secretary', photoUrl: null, contact: 'nora.mensah@example.edu' }
    ];
    res.render('academics-src', { title: 'Current SRC', members });
});
app.get('/materials', (_req, res) => {
    res.render('materials', {
        title: 'Exam Materials',
        query: _req.query.query || '',
        type: _req.query.type || '',
        year: _req.query.year || ''
    });
});
app.get('/materials/submit', (req, res) => {
    res.render('upload', {
        title: 'Submit Study Material',
        success: req.query.success ? decodeURIComponent(req.query.success) : undefined,
        error: req.query.error ? decodeURIComponent(req.query.error) : undefined
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
        success: req.query.success ? decodeURIComponent(req.query.success) : undefined,
        error: req.query.error ? decodeURIComponent(req.query.error) : undefined
    });
});
app.post('/security/reports', upload.single('attachment'), async (req, res) => {
    try {
        const { kind, description, location_text, reporter_contact } = req.body;
        if (!kind || !description) {
            return res.redirect('/security/report?error=' + encodeURIComponent('Please fill in all required fields.'));
        }
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
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
    }
    catch (error) {
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
