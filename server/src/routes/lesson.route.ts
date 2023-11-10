/**
 * Specifies the middleware and controller functions to call for each route
 * relating to admin users.
 */
import express from 'express';
import { isAdmin } from '../controllers/admin.middleware';
import { getAllLessons } from '../controllers/lesson.controller';
import { isAuthenticated } from '../controllers/auth.middleware';
import 'dotenv/config';

const router = express.Router();

router.get('/all', isAdmin, isAuthenticated, getAllLessons);

export default router;
