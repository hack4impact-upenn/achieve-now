/**
 * All the controller functions containing the logic for routes relating to
 * student users.
 */
// eslint-disable-next-line
import express, { RequestHandler } from 'express';
import ApiError from '../util/apiError';
import StatusCode from '../util/statusCode';
import {
  getAllResourcesFromDB,
  createResource,
  updateResource,
  deleteResource,
  getLessonResources,
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
      .then((resourceList) => {
        const sorted = resourceList.sort((a, b) =>
          a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1,
        );
        res.status(StatusCode.OK).send(sorted);
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

const deleteResourceHandler: RequestHandler = async (req, res) => {
  const { resourceId } = req.params;
  const deletedResource = await deleteResource(resourceId);
  res.status(StatusCode.OK).send(deletedResource);
};

export {
  getLessonResourcesHandler,
  updateResourceHandler,
  createResourceHandler,
  getAllResources,
  deleteResourceHandler,
};
