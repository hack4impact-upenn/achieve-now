/**
 * Specifies the middleware and controller functions to call for each route
 * relating to admin users.
 */
import { isAuthenticated } from '../controllers/auth.middleware';
import express from 'express';
import { getAllResources, getSchool, getAllSchools } from '../controllers/school.controller';
import 'dotenv/config';

const schoolRouter = express.Router();

/**
 * A GET route to get all schools.
 */
schoolRouter.get('/all', getAllResources);

/**
 * A GET route with specific school id
 * id (string) - The school id of the particular school
 */
schoolRouter.get('/:id', getSchool);

/**
 * A GET route to get all schools.
 */
schoolRouter.get('/all', isAuthenticated, getAllSchools);

export default schoolRouter;
