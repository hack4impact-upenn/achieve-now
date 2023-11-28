import { Router } from 'express';
import { isAuthenticated } from '../controllers/auth.middleware';
import { isAdmin } from '../controllers/admin.middleware';
import {
  getAllSchools,
  getSchool,
  createSchool,
  deleteSchool,
  updateSchool,
} from '../controllers/school.controller';

const schoolRouter = Router();

/**
 * A GET route to get all schools.
 */
schoolRouter.get('/all', isAuthenticated, isAdmin, getAllSchools);

/**
 * A GET route with specific school id
 * id (string) - The school id of the particular school
 */
schoolRouter.get('/:id', getSchool);

/**
 * A POST route to create a school.
 */
schoolRouter.post('/create', isAuthenticated, isAdmin, createSchool);

/**
 * A PUT route to delete a school.
 */
schoolRouter.put('/delete', isAuthenticated, isAdmin, deleteSchool);

/**
 * A PUT route to update a school.
 */
// schoolRouter.put('/:schoolId', isAuthenticated, isAdmin, updateSchool);
schoolRouter.put('/update', isAuthenticated, isAdmin, updateSchool);

export default schoolRouter;
