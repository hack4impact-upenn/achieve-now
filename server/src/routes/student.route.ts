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
  getStudentsFromTeacherId,
  getStudent,
  updateStudentAttendance,
  deleteStudentAttendanceByDate,
  createStudentAttendanceByDate,
} from '../controllers/student.controller';
import { isAuthenticated } from '../controllers/auth.middleware';
import 'dotenv/config';

const router = express.Router();

/**
 * A GET route to get parent additional resources.
 * Expects the following fields in the URL:
 * id (string) - The student id of the particular student
 */
router.get('/resource/:id', isAuthenticated, getStudentResources);

/**
 * A GET route to get all students.
 */
router.get('/all', isAuthenticated, getAllStudents);

/**
 * A PUT route to delete a resource from the parent additional resources.
 * Expects a JSON body with the following fields:
 * id (string) - The student id of the particular student
 * resource (object) - The resource object
 */
router.delete('/delete-resource', isAuthenticated, isAdmin, deleteResource);
// isAuthenticated, isAdmin,

/**
 * A PUT route to assign a resource to a particular student.
 * Expects a JSON body with the following fields:
 * id (string) - The student id of the student
 * resource (object) - The resource object
 */
router.put('/assign-resource', isAuthenticated, isAdmin, updateResource);

/**
 * A GET route to get all users. Checks first if the requestor is a
 * authenticated and is an admin.
 */
router.get('/teacher/:id', getStudentsFromTeacherId);

router.get('/student/:id', getStudent);

router.put('/attendance', isAuthenticated, isAdmin, updateStudentAttendance);

router.put(
  '/attendance/create',
  isAuthenticated,
  isAdmin,
  createStudentAttendanceByDate,
);

router.put(
  '/attendance/delete',
  isAuthenticated,
  isAdmin,
  deleteStudentAttendanceByDate,
);

export default router;
