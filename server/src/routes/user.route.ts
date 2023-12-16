/**
 * Specifies the middleware and controller functions to call for each route
 * relating to admin users.
 */
import express from 'express';
import {
  getUser,
  getAllTeachers,
  putUser,
  getUserEmail,
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
userRouter.get('/id/:id', isAuthenticated, getUser);

/**
 * A GET route to get a user by their email
 */
userRouter.get('/email/:email', isAuthenticated, getUserEmail);

/**
 * A PUT route to put a user by their ID
 */
userRouter.put('/id/:id', isAuthenticated, putUser);

export default userRouter;
