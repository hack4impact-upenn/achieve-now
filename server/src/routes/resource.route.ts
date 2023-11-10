/**
 * Specifies the middleware and controller functions to call for each route
 * relating to admin users.
//  */
// import express from 'express';
// import { isAdmin } from '../controllers/admin.middleware';
import 'dotenv/config';
import { Router } from 'express';
import {
  createResourceHandler,
  getLessonResourcesHandler,
  updateResourceHandler,
  getAllResources,
} from '../controllers/resource.controller';
import { isAuthenticated } from '../controllers/auth.middleware';

const resourceRouter = Router();

resourceRouter.get('/all', getAllResources);

resourceRouter.get(
  '/lesson/:lessonId',
  isAuthenticated,
  getLessonResourcesHandler,
);

resourceRouter.put('/:resourceId', updateResourceHandler);

resourceRouter.post('/', createResourceHandler);

export default resourceRouter;
