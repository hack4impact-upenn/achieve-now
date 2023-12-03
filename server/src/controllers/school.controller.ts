/**
 * All the controller functions containing the logic for routes relating to
 * school.
 */
// eslint-disable-next-line
import express from 'express';
// eslint-disable-next-line
import ApiError from '../util/apiError';
import StatusCode from '../util/statusCode';
import {
  getAllSchoolsInDB,
  getSchoolByIdInDB,
} from '../services/school.service';

/**
 * Get all resources from the database. Upon success, send the a list of all schools in the res body with 200 OK status code.
 */
const getAllResources = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  return (
    getAllSchoolsInDB()
      .then((schoolList) => {
        res.status(StatusCode.OK).send(schoolList);
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch((e) => {
        next(ApiError.internal('Unable to retrieve all resources'));
      })
  );
};

// get a specific school
const getSchool = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { id } = req.params;
  if (!id) {
    next(ApiError.missingFields(['id']));
  }

  const school = await getSchoolByIdInDB(id);

  if (!school) {
    next(ApiError.notFound('Unable to retrieve specified school'));
    return;
  }

  res.status(StatusCode.OK).send(school);
};

const getAllSchools = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  return getAllSchoolsInDB()
    .then((schoolList) => {
      res.status(StatusCode.OK).send(schoolList);
    })
    .catch((e) => {
      console.log(e);
      next(ApiError.internal('Unable to retrieve all schools'));
    });
};

export { getAllResources, getSchool, getAllSchools };
