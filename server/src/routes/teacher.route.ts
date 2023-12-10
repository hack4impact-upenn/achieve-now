import { Router } from 'express';
import { isAuthenticated } from '../controllers/auth.middleware';
import { getLessonLevel } from '../controllers/teacher.controller';
import { isTeacher } from '../controllers/teacher.middleware';
import { approve } from '../controllers/auth.controller';

const teacherRouter = Router();

/**
 * A GET route to check if the requestor is an admin. Checks first if the
 * requestor is a authenticated. Throws an error if the requestor is not an admin.
 */
teacherRouter.get('/teacherstatus', isAuthenticated, isTeacher, approve);

teacherRouter.get(
  '/lesson-levels/:teacher_id',
  isAuthenticated,
  getLessonLevel,
);

export default teacherRouter;
