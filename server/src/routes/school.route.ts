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

//get all schools
schoolRouter.get('/all', getAllSchools);
//isAuthenticated, isAdmin, 

//create school
schoolRouter.post('/create', createSchool);

//delete school
schoolRouter.put('/delete', deleteSchool);

//update school
schoolRouter.put('/update', updateSchool);

export default schoolRouter;
