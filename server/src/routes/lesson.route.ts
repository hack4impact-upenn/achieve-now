/**
 * Specifies the middleware and controller functions to call for each route
 * relating to admin users.
 */
import express from 'express';
import { isAdmin } from '../controllers/admin.middleware';
import {
  getLessonResources,
  deleteResource,
  updateResource,
  getAllLessons,
} from '../controllers/lesson.controller';
import { isAuthenticated } from '../controllers/auth.middleware';
import 'dotenv/config';

const router = express.Router();

/**
 * A GET route to get parent resources.
 * Expects the following fields in the URL:
 * id (string) - The lesson id of the particular lesson
 */
router.get('/resource/:id', getLessonResources);

/**
 * A GET route to get lesson by id.
 * Expects the following fields in the URL:
 * id (string) - The lesson id of the particular lesson
 */
router.get('/:id', getLessonResources);

/**
 * A GET route to get all lessons.
 */
router.get('/all', getAllLessons);

/**
 * A PUT route to delete a resource from the parent resources.
 * Expects a JSON body with the following fields:
 * id (string) - The lesson id
 * resource (object) - The resource object
 */
router.delete('/delete-resource', deleteResource);

/**
 * A PUT route to assign a resource to a particular lesson.
 * Expects a JSON body with the following fields:
 * id (string) - The lesson id
 * resource (object) - The resource object
 */
router.put('/assign-resource', updateResource);
export default router;
