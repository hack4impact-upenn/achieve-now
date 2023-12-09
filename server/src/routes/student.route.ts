/**
 * Specifies the middleware and controller functions to call for each route
 * relating to admin users.
 */
import express from 'express';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { addListener } from 'process';
import { isAdmin } from '../controllers/admin.middleware';
import {
  getStudentInformation,
  getAdditionalStudentResources,
  getAllStudentResources,
  getStudentsByTeacherID,
  deleteResource,
  addResource,
  getAllStudents,
  getStudentsFromTeacherId,
  getStudent,
  getAllStudentsWithUserLesson,
  updateStudentAttendance,
  deleteStudentAttendanceByDate,
  createStudentAttendanceByDate,
  addCoach,
  updateProgress,
  deleteProgress,
  isTeacher,
  updateStudentInformation,
  updateStudentLessonLevel,
} from '../controllers/student.controller';
import { inviteUser } from '../controllers/admin.controller';
import { isAuthenticated } from '../controllers/auth.middleware';
import 'dotenv/config';

const router = express.Router();

/**
 * A POST route to get role-based additional resources for a given student.
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
router.post('/resource/all/:id', getAllStudentResources);

/**
 * A GET route to get all resources for a given teacher email, it returns all the students
 * associated with the teacher
 */
router.get(
  '/students-by-teacher/:email',
  isAuthenticated,
  isTeacher,
  getStudentsByTeacherID,
);

/**
 * A GET route to get (both the student obj and the user obj)
 * of the student’s information by their student ID
 * Expects the following fields in the URL:
 * id (string) - The student id of the particular student
 */
router.get('/allInfo/:id', isAuthenticated, getStudentInformation);

/**
 * A POST route to edit (both the student obj and the user obj)
 * of the student’s information by their student ID
 * Expects the following fields in the URL:
 * id (string) - The student id of the particular student
 */
router.post('/allInfo/:id', isAuthenticated, updateStudentInformation);

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
router.post('/assign-resource', isAuthenticated, isAdmin, addResource);

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

router.put('/attendance', isAuthenticated, isAdmin, updateStudentAttendance);

router.put(
  '/update-lesson-level',
  isAuthenticated,
  isAdmin,
  updateStudentLessonLevel,
);

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

router.put('/add-coach', addCoach);
router.put('/progress/:id', updateProgress);
router.delete('/progress/:id/:date', deleteProgress);

/**
 * A POST route to invite a new student
 * Expects a JSON body with the following fields:
 * - email (string) - The email to invite the student from
 * - userType (string) - The type of student to invite
 * - active (boolean) - Whether the student is active or not
 */
router.post('/invite', isAuthenticated, isTeacher, inviteUser);

export default router;
