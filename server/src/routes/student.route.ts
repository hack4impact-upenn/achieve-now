/**
 * Specifies the middleware and controller functions to call for each route
 * relating to admin users.
 */
import express from 'express';
import { isAdmin } from '../controllers/admin.middleware';
import {
  getAdditionalStudentResources,
  getAllStudentResources,
  deleteResource,
  updateResource,
  getAllStudents,
  getStudentsFromTeacherId,
  getStudent,
  getAllStudentsWithUserLesson,
} from '../controllers/student.controller';
import { isAuthenticated } from '../controllers/auth.middleware';
import 'dotenv/config';

const router = express.Router();

/**
 * A GET route to get role-based additional resources for a given student.
 * Expects the following fields in the URL:
 * id (string) - The student id of the particular student
 * In the body:
 * role (string) - The role of the user making the request (parent, coach, admin)
 */
router.post(
  '/resource/additional/:id',
  isAuthenticated,
  getAdditionalStudentResources,
);

/**
 * A GET route to get all resources for a given student, additional and lesson based.
 * In the body:
 * role (string) - The role of the user making the request (parent, coach, admin)
 * In the url:
 * id (string) - The student id of the particular student
 */
router.post('/resources/all/:id', isAuthenticated, getAllStudentResources);

/**
 * A GET route to get all students.
 */
router.get('/all', isAuthenticated, getAllStudents);

/**
 * A PUT route to delete a resource from the parent additional resources.
 * Expects a JSON body with the following fields:
 * id (string) - The student id of the particular student
 * resource (object) - The resource object
 * role (string) - The role of the user making the request (parent, coach)
 */
router.post('/delete-resource', isAuthenticated, isAdmin, deleteResource);

/**
 * A PUT route to assign a resource to a particular student.
 * Expects a JSON body with the following fields:
 * id (string) - The student id of the student
 * resource (object) - The resource object
 * role (string) - The role of the user making the request (parent, coach)
 */
router.post('/assign-resource', isAuthenticated, isAdmin, updateResource);

/**
 * A GET route to get all users. Checks first if the requestor is a
 * authenticated and is an admin.
 */
router.get('/teacher/:id', isAuthenticated, getStudentsFromTeacherId);

router.get('/student/:id', isAuthenticated, getStudent);

/**
 * A GET route to get all students and all of their additional information (user and lesson)
 * Checks first if the requestor is authenticated or an admin
 */
router.get('/all/info', isAuthenticated, isAdmin, getAllStudentsWithUserLesson);

export default router;
