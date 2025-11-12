import { Router } from 'express';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import { prisma } from '../db/prisma.js';
export function authRouter() {
    const router = Router();
    // Login page
    router.get('/login', (req, res) => {
        if (req.session?.user) {
            return res.redirect('/');
        }
        res.render('login', {
            title: 'Login',
            error: req.query.error,
            redirect: req.query.redirect
        });
    });
    // Register page
    router.get('/register', (req, res) => {
        if (req.session?.user) {
            return res.redirect('/');
        }
        res.render('register', {
            title: 'Register',
            error: req.query.error
        });
    });
    // Login handler
    router.post('/login', body('email').isEmail().normalizeEmail(), body('password').notEmpty(), async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('login', {
                title: 'Login',
                error: 'Please provide valid email and password.',
                redirect: req.body.redirect
            });
        }
        const { email, password } = req.body;
        try {
            const user = await prisma.user.findUnique({
                where: { email }
            });
            if (!user) {
                return res.render('login', {
                    title: 'Login',
                    error: 'Invalid email or password.',
                    redirect: req.body.redirect
                });
            }
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.render('login', {
                    title: 'Login',
                    error: 'Invalid email or password.',
                    redirect: req.body.redirect
                });
            }
            // Set session
            req.session.user = {
                id: user.id,
                email: user.email,
                name: user.name || undefined,
                role: user.role
            };
            const redirect = req.body.redirect || '/';
            return res.redirect(redirect);
        }
        catch (error) {
            console.error('Login error:', error);
            return res.render('login', {
                title: 'Login',
                error: 'An error occurred. Please try again.',
                redirect: req.body.redirect
            });
        }
    });
    // Register handler
    router.post('/register', body('email').isEmail().normalizeEmail(), body('password').isLength({ min: 6 }), body('name').optional().trim(), async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('register', {
                title: 'Register',
                error: 'Please provide valid email and password (min 6 characters).'
            });
        }
        const { email, password, name } = req.body;
        try {
            // Check if user exists
            const existingUser = await prisma.user.findUnique({
                where: { email }
            });
            if (existingUser) {
                return res.render('register', {
                    title: 'Register',
                    error: 'Email already registered. Please login instead.'
                });
            }
            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);
            // Create user
            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name: name || null,
                    role: 'student'
                }
            });
            // Set session
            req.session.user = {
                id: user.id,
                email: user.email,
                name: user.name || undefined,
                role: user.role
            };
            return res.redirect('/');
        }
        catch (error) {
            console.error('Register error:', error);
            return res.render('register', {
                title: 'Register',
                error: 'An error occurred. Please try again.'
            });
        }
    });
    // Logout handler
    router.post('/logout', (req, res) => {
        req.session?.destroy((err) => {
            if (err) {
                console.error('Logout error:', err);
            }
            res.redirect('/');
        });
    });
    return router;
}
