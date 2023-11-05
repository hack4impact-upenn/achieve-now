import express from 'express';
import ApiError from '../util/apiError';
import StatusCode from '../util/statusCode';
import { getAllSchoolsfromDB } from '../services/school.service';

const getAllSchools = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  return getAllSchoolsfromDB()
    .then((schoolList) => {
      res.status(StatusCode.OK).send(schoolList);
    })
    .catch((e) => {
      console.log(e);
      next(ApiError.internal('Unable to retrieve all schools'));
    });
};

export default getAllSchools;
