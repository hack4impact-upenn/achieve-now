/**
 * Specifies the middleware and controller functions to call for each route
 * relating to admin users.
 */
import express from 'express';
import getUser from '../controllers/user.controller';
import 'dotenv/config';

const router = express.Router();

/**
 * A GET route to get a user by their ID
 */
router.get('/:id', getUser);

export default router;
