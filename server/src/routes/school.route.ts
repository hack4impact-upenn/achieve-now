import express from 'express';
import { isAuthenticated } from '../controllers/auth.middleware';
import getAllSchools from '../controllers/school.controller';

const schoolRouter = express.Router();
/**
 * A GET route to get all schools.
 */
schoolRouter.get('/all', isAuthenticated, getAllSchools);

export default schoolRouter;
