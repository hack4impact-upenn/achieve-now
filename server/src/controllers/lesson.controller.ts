import express from 'express';
import ApiError from '../util/apiError';
import StatusCode from '../util/statusCode';
import { getAllLessonsfromDB } from '../services/lesson.service';

const getAllLessons = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  return getAllLessonsfromDB()
    .then((lessonList) => {
      res.status(StatusCode.OK).send(lessonList);
    })
    .catch((e) => {
      console.log(e);
      next(ApiError.internal('Unable to retrieve all lessons'));
    });
};

export default getAllLessons;
