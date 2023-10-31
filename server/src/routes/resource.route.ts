/**
 * Specifies the middleware and controller functions to call for each route
 * relating to admin users.
 */
import { Router } from 'express';
import 'dotenv/config';
import {
  createResourceHandler,
  updateResourceHandler,
  getAllResources,
} from '../controllers/resource.controller';
import { isAuthenticated } from '../controllers/auth.middleware';
import { isAdmin } from '../controllers/admin.middleware';

const resourceRouter = Router();

resourceRouter.get('/all', isAuthenticated, getAllResources);

resourceRouter.put(
  '/:resourceId',
  isAuthenticated,
  isAdmin,
  updateResourceHandler,
);

resourceRouter.post('/', isAuthenticated, isAdmin, createResourceHandler);

export default resourceRouter;
