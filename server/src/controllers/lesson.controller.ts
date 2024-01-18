/**
 * All the controller functions containing the logic for routes relating to
 * lessons.
 */
import express from 'express';
import ApiError from '../util/apiError';
import StatusCode from '../util/statusCode';
import {
  getLessonById,
  getLessonByLevel,
  deleteResource,
  addResource,
  getAllLessonsFromDB,
  addLesson,
  editLessonByNumber,
  deleteLessonById,
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
    title: lesson.title,
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

  deleteResource(lesson, role, resource)
    .then((response) =>
      response
        ? res.status(StatusCode.OK).send(response)
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

const getLessonFromLevel = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { level } = req.params;
  if (!level) {
    next(ApiError.missingFields(['level']));
    return;
  }
  const lesson = await getLessonByLevel(level);
  if (!lesson) {
    next(ApiError.badRequest('No Lesson Level Found'));
    return;
  }
  res.status(StatusCode.OK).send(lesson);
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

  const response = await addResource(lesson, role, resource);
  if (response) {
    res.status(StatusCode.OK).send(response);
    return;
  }
  res.sendStatus(StatusCode.NOT_FOUND);
};

const addLessonHandler = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { title } = req.body;

  if (!title) {
    next(ApiError.missingFields(['title']));
    return;
  }
  addLesson(title)
    .then((response) =>
      res.status(StatusCode.OK).send(response)
    )
    .catch((e: any) => {
      console.log(e);
      next(ApiError.internal('Failed to add lesson.'));
    });
};

const editLessonHandler = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { title, number } = req.body;

  if (!title) {
    next(ApiError.badRequest('Lesson Title cannot be empty'));
    return;
  }
  if (!number) {
    next(ApiError.badRequest('Lesson Number cannot be 0 or empty'));
    return;
  }
  if (typeof(number) !== 'number') {
    next(ApiError.badRequest('Lesson Number has to be a number'));
    return;
  }

  const lessons = await getAllLessonsFromDB();
  if (!lessons) {
    next(ApiError.badRequest('No lessons found'));
    return;
  }

  if (number < 1 || number > lessons.length) {
    next(ApiError.badRequest(`Input Number must be within existing Lesson Number range (1 - ${lessons.length})`));
    return;
  }

  editLessonByNumber(number, title)
    .then((response) =>
      res.status(StatusCode.OK).send(response)
    )
    .catch((e: any) => {
      console.log(e);
      next(ApiError.internal('Failed to edit lesson.'));
    });
};

const deleteLastLessonHandler = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const lessons = await getAllLessonsFromDB();
  if (!lessons) {
    next(ApiError.badRequest('no lessons found'));
    return;
  }

  const lastLessonId = lessons[lessons.length - 1].id;
  deleteLessonById(lastLessonId)
    .then((response) =>
      response
        ? res.status(StatusCode.OK).send(response)
        : res.sendStatus(StatusCode.NOT_FOUND),
    )
    .catch((e: any) => {
      console.log(e);
      next(ApiError.internal('Failed to delete lesson.'));
    });
  };

export {
  getAllLessonsHandler,
  getLessonResourcesHandler,
  deleteResourceHandler,
  addResourceHandler,
  getLesson,
  getLessonFromLevel,
  addLessonHandler,
  editLessonHandler,
  deleteLastLessonHandler,
};
