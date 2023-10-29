import express from 'express';
import ApiError from '../util/apiError';
import {
  getAllSchoolsFromDB,
  createSchoolInDB,
  deleteSchoolById,
  updateSchoolById,
} from '../services/school.service';
import StatusCode from '../util/statusCode';

/**
 * Get all students from the database. Upon success, send the a list of all students in the res body with 200 OK status code.
 */
const getAllSchools = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  return (
    getAllSchoolsFromDB()
      .then((schoolList: any) => {
        res.status(StatusCode.OK).send(schoolList);
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch((e) => {
        next(ApiError.internal('Unable to retrieve all schools'));
      })
  );
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

  const school = await createSchoolInDB(
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
    _id,
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
  if (!_id) {
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
    _id,
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
  res.status(StatusCode.OK).send(school);
};

export { getAllSchools, createSchool, deleteSchool, updateSchool };
