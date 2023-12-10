/**
 * All the middleware functions related to student users
 */
import express from 'express';
import ApiError from '../util/apiError';
import { IUser } from '../models/user.model';

/**
 * Middleware to check if a user is a student using Passport Strategy
 * and creates an {@link ApiError} to pass on to error handlers if not
 */
const isStudent = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  // Get User
  const user: IUser | null = req.user as IUser;
  // Check is user exists and is valid
  if (!user) {
    next(ApiError.unauthorized('Not a valid user.')); // TODO: see if this is the correct message
    return;
  }
  // Check if the user is an admin
  if (user.role === 'parent') {
    next();
  } else {
    next(ApiError.unauthorized('Need student status.'));
  }
};

// eslint-disable-next-line import/prefer-default-export
export { isStudent };
