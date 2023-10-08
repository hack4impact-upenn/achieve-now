/**
 * Specifies the middleware and controller functions to call for each route
 * relating to admin users.
 */
import express from 'express';
import { isAdmin } from '../controllers/admin.middleware';
import { getUser } from '../controllers/user.controller';
import { isAuthenticated } from '../controllers/auth.middleware';
import 'dotenv/config';

const router = express.Router();

/**
 * A GET route to get a user by their ID
 */
<<<<<<< HEAD
router.get('/:id', getUser);
=======
router.get('/:id', isAuthenticated, isAdmin, getUser);
>>>>>>> main

export default router;
