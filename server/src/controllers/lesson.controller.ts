/**
 * All the controller functions containing the logic for routes relating to
 * student users.
 */
import express from 'express';
import ApiError from '../util/apiError';
import StatusCode from '../util/statusCode';
import { getAllLessonsFromDB } from '../services/lesson.service';

/**
 * Get all lessons from the database. Upon success, send the a list of all students in the res body with 200 OK status code.
 */
const getAllLessons = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  return (
    getAllLessonsFromDB()
      .then((userList) => {
        res.status(StatusCode.OK).send(userList);
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch((e) => {
        next(ApiError.internal('Unable to retrieve all lessons'));
      })
  );
};
// eslint-disable-next-line
export { getAllLessons };
