/**
 * All the controller functions containing the logic for routes relating to
 * student users.
 */
import express from 'express';
import { RequestHandler } from 'express';
import ApiError from '../util/apiError';
import StatusCode from '../util/statusCode';
import {
  getAllResourcesFromDB,
  createResource,
  getLessonResources,
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

const getLessonResourcesHandler: RequestHandler = async (req, res) => {
  const { lessonId } = req.params;
  const resources = await getLessonResources(lessonId);
  if (!resources) {
    res.sendStatus(StatusCode.NOT_FOUND);
    return;
  }
  res.status(StatusCode.OK).send(resources);
};

const updateResourceHandler: RequestHandler = async (req, res) => {
  const { resourceId } = req.params;
  const resource = req.body;
  const updatedResource = await updateResource(resourceId, resource);
  if (!updatedResource) {
    res.sendStatus(StatusCode.NOT_FOUND);
    return;
  }
  res.status(StatusCode.OK).send(updatedResource);
};

const createResourceHandler: RequestHandler = async (req, res) => {
  const resource = req.body;
  const newResource = await createResource(resource);
  res.status(StatusCode.OK).send(newResource);
};

export {
  getLessonResourcesHandler,
  updateResourceHandler,
  createResourceHandler,
  getAllResources,
};
