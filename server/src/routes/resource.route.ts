/**
 * Specifies the middleware and controller functions to call for each route
 * relating to admin users.
 */
import express from 'express';
import { isAdmin } from '../controllers/admin.middleware';
import { getAllResources } from '../controllers/resource.controller';
import { isAuthenticated } from '../controllers/auth.middleware';
import 'dotenv/config';

const router = express.Router();

/**
 * A GET route to get all resources.
 */
router.get('/all', getAllResources);

export default router;
