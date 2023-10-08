import { Router } from 'express';
import {
  createResourceHandler,
  getLessonResourcesHandler,
  updateResourceHandler,
} from '../controllers/resource.controller';
import { isAuthenticated } from '../controllers/auth.middleware';

const resourceRouter = Router();

resourceRouter.get(
  '/lesson/:lessonId',
  isAuthenticated,
  getLessonResourcesHandler,
);

resourceRouter.put('/:resourceId', updateResourceHandler);

resourceRouter.post('/', createResourceHandler);

export default resourceRouter;
