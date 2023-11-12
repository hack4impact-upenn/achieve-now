import { Router } from 'express';
import { isAuthenticated } from '../controllers/auth.middleware';
import { isAdmin } from '../controllers/admin.middleware';
import {
  getAllSchools,
  createSchool,
  deleteSchool,
  updateSchool,
} from '../controllers/school.controller';

const schoolRouter = Router();

// get all schools
schoolRouter.get('/all', isAuthenticated, isAdmin, getAllSchools);

// create school
schoolRouter.post('/create', isAuthenticated, isAdmin, createSchool);

// delete school
schoolRouter.put('/delete', isAuthenticated, isAdmin, deleteSchool);

// update school
// schoolRouter.put('/:schoolId', isAuthenticated, isAdmin, updateSchool);
schoolRouter.put('/update', isAuthenticated, isAdmin, updateSchool);

export default schoolRouter;
