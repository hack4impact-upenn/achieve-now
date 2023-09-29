import { RequestHandler } from 'express';
import {
  createResource,
  getLessonResources,
  updateResource,
} from '../services/resource.service';
import StatusCode from '../util/statusCode';

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
};
