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
  createSchoolInDB,
  deleteSchoolById,
  updateSchoolById,
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

const createSchool = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const {
    name,
    teachers,
    info,
    admin_name,
    admin_content,
    calendar_link,
    school_start_time,
    school_end_time,
    first_grade_lunch_start_time,
    first_grade_lunch_end_time,
    second_grade_lunch_start_time,
    second_grade_lunch_end_time,
  } = req.body;

  if (!name) {
    next(ApiError.missingFields(['name']));
    return;
  }

  if (!teachers) {
    next(ApiError.missingFields(['teachers']));
    return;
  }

  if (!info) {
    next(ApiError.missingFields(['info']));
    return;
  }
  let temp_admin_name = '';
  if (admin_name) {
    temp_admin_name = admin_name;
  }

  const school = await createSchoolInDB(
    name,
    teachers,
    info,
    temp_admin_name,
    admin_content,
    calendar_link,
    school_start_time,
    school_end_time,
    first_grade_lunch_start_time,
    first_grade_lunch_end_time,
    second_grade_lunch_start_time,
    second_grade_lunch_end_time,
  );
  console.log('logged here');
  console.log(school);

  res.status(StatusCode.OK).send(school);
};

const deleteSchool = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { id } = req.body;
  if (!id) {
    next(ApiError.missingFields(['id']));
    return;
  }

  const school = deleteSchoolById(id);
  res.status(StatusCode.OK).send(school);
};

const updateSchool = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const {
    id,
    name,
    teachers,
    info,
    admin_name,
    admin_content,
    calendar_link,
    school_start_time,
    school_end_time,
    first_grade_lunch_start_time,
    first_grade_lunch_end_time,
    second_grade_lunch_start_time,
    second_grade_lunch_end_time,
  } = req.body;
  if (!id) {
    next(ApiError.missingFields(['_id']));
    return;
  }

  if (!name) {
    next(ApiError.missingFields(['name']));
    return;
  }
  if (!teachers) {
    next(ApiError.missingFields(['teachers']));
    return;
  }
  if (!info) {
    next(ApiError.missingFields(['info']));
    return;
  }

  const school = updateSchoolById(
    id,
    name,
    teachers,
    info,
    admin_name,
    admin_content,
    calendar_link,
    school_start_time,
    school_end_time,
    first_grade_lunch_start_time,
    first_grade_lunch_end_time,
    second_grade_lunch_start_time,
    second_grade_lunch_end_time,
  );
  console.log(school);
  res.status(StatusCode.OK).send(school);
};

export {
  getAllResources,
  getSchool,
  getAllSchools,
  createSchool,
  deleteSchool,
  updateSchool,
};
