/**
 * All the controller functions containing the logic for routes relating to
 * lessons.
 */
import express from 'express';
import ApiError from '../util/apiError';
import StatusCode from '../util/statusCode';
import {
  getLessonById,
  deleteResource,
  addResource,
  getAllLessonsFromDB,
} from '../services/lesson.service';
import { getResourceByID } from '../services/student.service';
import { ILesson } from '../models/lesson.model';

const getAllLessonsHandler = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const lessons = await getAllLessonsFromDB();
  if (!lessons) {
    next(ApiError.badRequest('no lessons found'));
    return;
  }
  res.status(StatusCode.OK).send(lessons);
};

const getLessonResourcesHandler = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { lessonId } = req.params;
  const lesson = await getLessonById(lessonId);
  if (!lesson) {
    next(ApiError.badRequest('no lesson found'));
    return;
  }
  const parentPromises = lesson.parent_resources?.map((resource) =>
    getResourceByID(resource),
  );
  const parentResources = await Promise.all(parentPromises);

  const coachPromises = lesson.coach_resources?.map((resource) =>
    getResourceByID(resource),
  );
  const coachResources = await Promise.all(coachPromises);
  const newLessonObj = {
    _id: lesson._id,
    number: lesson.number,
    parent_resources: parentResources,
    coach_resources: coachResources,
  };
  res.status(StatusCode.OK).send(newLessonObj);
};

/**
 * Delete resource for a particular lesson. Send a 200 OK status code on success.
 */
const deleteResourceHandler = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { id, resource, role } = req.body;

  if (!id) {
    next(ApiError.missingFields(['id']));
    return;
  }
  if (!resource) {
    next(ApiError.missingFields(['resource']));
    return;
  }
  if (!role) {
    next(ApiError.missingFields(['role']));
    return;
  }

  // Check if lesson exists
  const lesson: ILesson | null = await getLessonById(id);
  if (!lesson) {
    next(ApiError.notFound(`Lesson with id ${id} does not exist`));
    return;
  }

  deleteResource(id, role, resource)
    .then((response) =>
      response
        ? res.sendStatus(StatusCode.OK).send(response)
        : res.sendStatus(StatusCode.NOT_FOUND),
    )
    .catch((e: any) => {
      console.log(e);
      next(ApiError.internal('Failed to delete resource.'));
    });
};

const getLesson = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { id } = req.params;
  if (!id) {
    next(ApiError.internal('Request must include a valid userID param'));
  }

  return (
    getLessonById(id)
      .then((lesson) => {
        res.status(StatusCode.OK).send(lesson);
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch((e) => {
        next(ApiError.internal('Unable to retrieve specified lesson'));
      })
  );
};

/**
 * Update lesson resource (add specified).
 */
const addResourceHandler = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { id, resource, role } = req.body;
  if (!id) {
    next(ApiError.missingFields(['id']));
    return;
  }
  if (!resource) {
    next(ApiError.missingFields(['resource']));
    return;
  }
  if (!role) {
    next(ApiError.missingFields(['role']));
    return;
  }

  // Check if lesson exists
  const lesson: ILesson | null = await getLessonById(id);
  if (!lesson) {
    next(ApiError.notFound(`Lesson with id ${id} does not exist`));
    return;
  }

  // Check if resource exists
  const resourceObj = await getResourceByID(resource);
  if (!resourceObj) {
    next(ApiError.notFound(`Resource with id ${resource} does not exist`));
    return;
  }

  const response = await addResource(id, role, resource);
  if (response) {
    res.sendStatus(StatusCode.OK).send(response);
    return;
  }
  res.sendStatus(StatusCode.NOT_FOUND);
};

export {
  getAllLessonsHandler,
  getLessonResourcesHandler,
  deleteResourceHandler,
  addResourceHandler,
  getLesson,
};
