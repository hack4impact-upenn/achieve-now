/**
 * Specifies the middleware and controller functions to call for each route
 * relating to admin users.
 */
import express from 'express';
import { isAdmin } from '../controllers/admin.middleware';
import {
  getUser,
  getAllTeachers,
  putUser,
} from '../controllers/user.controller';
import { isAuthenticated } from '../controllers/auth.middleware';
import 'dotenv/config';

const userRouter = express.Router();

/**
 * A GET route to get all teachers.
 */
userRouter.get('/allTeachers', isAuthenticated, getAllTeachers);

/**
 * A GET route to get a user by their ID
 */
userRouter.get('/:id', getUser);

/**
 * A PUT route to put a user by their ID
 */
userRouter.put('/:id', putUser);

export default userRouter;
