/**
 * All the controller functions containing the logic for routes relating to lessons.
 */
import express from 'express';
import ApiError from '../util/apiError';
import StatusCode from '../util/statusCode';
import { ILesson } from '../models/lesson.model';
import {
    getAllLessonsFromDB,
    getLessonByID,
    getResourceByID,
    updateResourcesByID,
} from '../services/lesson.service';

/**
 * Get all lesson from the database. Upon success, send the a list of all lessons in the res body with 200 OK status code.
 */
const getAllLessons = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  return (
    getAllLessonsFromDB()
      .then((list) => {
        console.log(list)
        res.status(StatusCode.OK).send(list);
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch((e) => {
        next(ApiError.internal('Unable to retrieve all lessons'));
      })
  );
};

/**
 * Get resources for a particular lesson. Send a 200 OK status code on success.
 */
const getLessonResources = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { id } = req.params;
  if (!id) {
    next(ApiError.missingFields(['id']));
    return;
  }

  const lesson: ILesson | null = await getLessonByID(id);
  if (!lesson) {
    next(ApiError.notFound(`Lesson with id ${id} does not exist`));
    return;
  }

  const resources = [];

  if (lesson.parent_resources) {
    for (let i = 0; i < lesson.parent_resources.length; i++) {
      const resource_id = lesson.parent_resources[i];
      let res = await getResourceByID(resource_id);
      resources.push(res);
    }
  }

  res.status(StatusCode.OK).send(resources);
};

/**
 * Delete resource for a particular lesson. Send a 200 OK status code on success.
 */
const deleteResource = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { id } = req.body;
  const { resource } = req.body;

  if (!id) {
    // next(ApiError.missingFields(['id']));
    return;
  }

  if (!resource) {
    // next(ApiError.missingFields(['resource']));
    return;
  }

  // Check if lesson exists
  const lesson: ILesson | null = await getLessonByID(id);
  if (!lesson) {
    next(ApiError.notFound(`Lesson with id ${id} does not exist`));
    return;
  }
  if (!lesson.parent_resources) {
    next(ApiError.notFound(`Lesson does not have any resources.`));
    return;
  }

  const updated_resources = lesson.parent_resources.filter(
    (item) => item !== resource,
  );

  console.log('updated: ' + updated_resources);

  updateResourcesByID(id, updated_resources)
    .then((lesson) => res.status(StatusCode.OK).send(lesson))
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .catch((e) => {
      next(ApiError.internal('Failed to delete resource.'));
    });
};

/**
 * Update lesson resource (add specified).
 */
const updateResource = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { id } = req.body;
  const { resource } = req.body;
  if (!id) {
    next(ApiError.missingFields(['id']));
    return;
  }
  if (!resource) {
    next(ApiError.missingFields(['resource']));
    return;
  }

  // Check if lesson exists
  const lesson: ILesson | null = await getLessonByID(id);
  if (!lesson) {
    next(ApiError.notFound(`Lesson with id ${id} does not exist`));
    return;
  }

  let resources = [];

  if (lesson.parent_resources) {
    resources = lesson.parent_resources;
  } else {
    resources.push('');
  }
  console.log('original: ' + resources);

  resources.push(resource);

  const updated_resources = resources.filter((item) => item !== '');

  console.log('updated: ' + updated_resources);

  updateResourcesByID(id, updated_resources)
    .then(() => res.sendStatus(StatusCode.OK))
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .catch((e) => {
      next(ApiError.internal('Failed to add resource.'));
    });
};

export { getLessonResources, deleteResource, updateResource, getAllLessons };