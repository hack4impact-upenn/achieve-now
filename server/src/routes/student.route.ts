/**
 * Specifies the middleware and controller functions to call for each route
 * relating to admin users.
 */
import express from 'express';
import { isAdmin } from '../controllers/admin.middleware';
import {
  getStudentResources,
  deleteResource,
  updateResource,
  getAllStudents,
} from '../controllers/student.controller';
import { isAuthenticated } from '../controllers/auth.middleware';
import 'dotenv/config';

const router = express.Router();

/**
 * A GET route to get parent additional resources.
 * Expects the following fields in the URL:
 * id (string) - The student id of the particular student
 */
router.get('/resource/:id', getStudentResources);

/**
 * A GET route to get all students.
 */
router.get('/all', getAllStudents);

/**
 * A PUT route to delete a resource from the parent additional resources.
 * Expects a JSON body with the following fields:
 * id (string) - The student id of the particular student
 * resource (object) - The resource object
 */
router.delete('/delete-resource', deleteResource);
// isAuthenticated, isAdmin,

/**
 * A PUT route to assign a resource to a particular student.
 * Expects a JSON body with the following fields:
 * id (string) - The student id of the student
 * resource (object) - The resource object
 */
router.put('/assign-resource', updateResource);
export default router;
