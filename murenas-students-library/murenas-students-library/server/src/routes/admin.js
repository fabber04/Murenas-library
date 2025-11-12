// server/src/routes/admin.js
import express from 'express';
import { getAdminDashboard } from '../controllers/adminController.js';

const router = express.Router();

// Route for the admin dashboard
router.get('/dashboard', getAdminDashboard);

export default router;