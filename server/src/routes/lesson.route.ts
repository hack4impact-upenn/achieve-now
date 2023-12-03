import { Router } from 'express';
import 'dotenv/config';
import {
  getLessonResourcesHandler,
  deleteResourceHandler,
  addResourceHandler,
  getAllLessonsHandler,
  getLesson,
  getLessonFromLevel,
} from '../controllers/lesson.controller';
import { isAuthenticated } from '../controllers/auth.middleware';
import { isAdmin } from '../controllers/admin.middleware';

const lessonRouter = Router();

lessonRouter.get('/all', isAuthenticated, getAllLessonsHandler);
lessonRouter.post(
  '/:lessonId/resources',
  isAuthenticated,
  getLessonResourcesHandler,
);
lessonRouter.post(
  '/deleteResource',
  isAuthenticated,
  isAdmin,
  deleteResourceHandler,
);
lessonRouter.post('/addResource', isAuthenticated, isAdmin, addResourceHandler);

lessonRouter.get('/:id', getLesson);

lessonRouter.get('/getLesson/:level', getLessonFromLevel);

export default lessonRouter;
