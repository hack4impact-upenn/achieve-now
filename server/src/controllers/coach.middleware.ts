/**
 * All the middleware functions related to coach users
 */
import express from 'express';
import ApiError from '../util/apiError';
import { IUser } from '../models/user.model';

/**
 * Middleware to check if a user is an admin using Passport Strategy
 * and creates an {@link ApiError} to pass on to error handlers if not
 */
const isCoach = (
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
  // Check if the user is an coach
  if (user.role === 'coach') {
    next();
  } else {
    next(ApiError.unauthorized('Need coach status.'));
  }
};

// eslint-disable-next-line import/prefer-default-export
export { isCoach };
