/* eslint-disable camelcase */
import express from 'express';
import ApiError from '../util/apiError';
import { getLessonLevelsByTeacherId } from '../services/teacher.service';

const getLessonLevel = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { teacher_id } = req.params;

  if (!teacher_id) {
    return ApiError.missingFields(['teacher_id']);
  }

  const levels = await getLessonLevelsByTeacherId(teacher_id);

  return res.status(200).json(levels);
};

export { getLessonLevel };
