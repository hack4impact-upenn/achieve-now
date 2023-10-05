/**
 * All the controller functions containing the logic for routes relating to
 * student users.
 */
import express from 'express';
import ApiError from '../util/apiError';
import StatusCode from '../util/statusCode';
import { getAllResourcesFromDB } from '../services/resource.service';

/**
 * Get all resources from the database. Upon success, send the a list of all students in the res body with 200 OK status code.
 */
const getAllResources = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  return (
    getAllResourcesFromDB()
      .then((userList) => {
        res.status(StatusCode.OK).send(userList);
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch((e) => {
        next(ApiError.internal('Unable to retrieve all resources'));
      })
  );
};

export { getAllResources };
