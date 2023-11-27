import { Router } from 'express';
import { isAuthenticated } from '../controllers/auth.middleware';
import { getLessonLevel } from '../controllers/teacher.controller';

const teacherRouter = Router();

teacherRouter.get(
  '/lesson-levels/:teacher_id',
  isAuthenticated,
  getLessonLevel,
);

export default teacherRouter;
