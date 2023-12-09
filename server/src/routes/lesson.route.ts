import { Router } from 'express';
import 'dotenv/config';
import {
  getLessonResourcesHandler,
  deleteResourceHandler,
  addResourceHandler,
  getAllLessonsHandler,
  getLesson,
  getLessonFromLevel,
  addLessonHandler,
  editLessonHandler,
  deleteLastLessonHandler,
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

lessonRouter.post('/addLesson', addLessonHandler);

lessonRouter.post('/editLesson', editLessonHandler);

lessonRouter.post('/deleteLesson', deleteLastLessonHandler);

export default lessonRouter;
