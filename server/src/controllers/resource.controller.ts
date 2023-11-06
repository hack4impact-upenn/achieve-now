/**
 * All the controller functions containing the logic for routes relating to
 * student users.
 */
// eslint-disable-next-line
import express from 'express';
import ApiError from '../util/apiError';
import StatusCode from '../util/statusCode';
import {
  getAllResourcesFromDB,
  createResource,
  updateResource,
} from '../services/resource.service';

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

const updateResourceHandler = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { resourceId } = req.params;
  const resource = req.body;
  const updatedResource = await updateResource(resourceId, resource);
  if (!updatedResource) {
    next(ApiError.badRequest('no resources found'));
  }
  res.status(StatusCode.OK).send(updatedResource);
};

const createResourceHandler = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const resource = req.body;
  createResource(resource)
    .then((newResource) => {
      res.status(StatusCode.OK).send(newResource);
    })
    .catch((e) => {
      console.log(e);
      next(ApiError.internal('Unable to create resource'));
    });
};

export { updateResourceHandler, createResourceHandler, getAllResources };
