/**
 * Specifies the middleware and controller functions to call for each route
 * relating to admin users.
 */
import express from 'express';
import { getAllTeachers, getUser } from '../controllers/user.controller';
import { isAuthenticated } from '../controllers/auth.middleware';
import 'dotenv/config';

const router = express.Router();

/**
 * A GET route to get a user by their ID
 */
router.get('/:id', getUser);

/**
 * A GET route to get all teachers.
 */
router.get('/allTeachers', isAuthenticated, getAllTeachers);

export default router;
