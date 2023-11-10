/* eslint-disable camelcase */

import express from 'express';
import ApiError from '../util/apiError';
import {
  createAttendanceOnDate,
  createCoachInDB,
  deleteAttendanceOnDate,
  getAllCoachesFromDB,
  getCoachBlocks,
  updateAttendance,
  getStudentFromCoach,
  getCoach,
} from '../services/coach.service';
import StatusCode from '../util/statusCode';

/**
 * Get all students from the database. Upon success, send the a list of all students in the res body with 200 OK status code.
 */
const getAllCoaches = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  return (
    getAllCoachesFromDB()
      .then((userList) => {
        res.status(StatusCode.OK).send(userList);
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch((e) => {
        next(ApiError.internal('Unable to retrieve all users'));
      })
  );
};

const createCoach = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { user_id, partner_site, mailing_address, media_waiver } = req.body;

  if (!user_id) {
    next(ApiError.missingFields(['user_id']));
    return;
  }

  if (!partner_site) {
    next(ApiError.missingFields(['partner_site']));
    return;
  }

  if (!mailing_address) {
    next(ApiError.missingFields(['mailing_address']));
    return;
  }

  if (!media_waiver) {
    next(ApiError.missingFields(['media_waiver']));
    return;
  }

  const coach = await createCoachInDB(
    user_id,
    partner_site,
    mailing_address,
    media_waiver,
  );

  res.status(StatusCode.OK).send(coach);
};

const updateCoachAttendance = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { id, date, attendance } = req.body;
  if (!id) {
    next(ApiError.missingFields(['id']));
    return;
  }
  if (!date) {
    next(ApiError.missingFields(['date']));
    return;
  }
  if (!attendance) {
    next(ApiError.missingFields(['attendance']));
    return;
  }

  const coach = updateAttendance(id, date, attendance);
  res.status(StatusCode.OK).send(coach);
};

const createCoachAttendanceByDate = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { date } = req.body;
  if (!date) {
    next(ApiError.missingFields(['date']));
    return;
  }

  const coach = createAttendanceOnDate(date);
  res.status(StatusCode.OK).send(coach);
};

const deleteCoachAttendanceByDate = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { date } = req.body;
  if (!date) {
    next(ApiError.missingFields(['date']));
    return;
  }

  const coach = deleteAttendanceOnDate(date);
  res.status(StatusCode.OK).send(coach);
};

const getCoachBlocksById = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { id } = req.params;
  if (!id) {
    next(ApiError.missingFields(['id']));
    return;
  }

  const blocks = await getCoachBlocks(id);
  res.status(StatusCode.OK).send(blocks);
};

const getStudentFromCoachById = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { id } = req.params;
  if (!id) {
    next(ApiError.missingFields(['id']));
    return;
  }

  const blocks = await getStudentFromCoach(id);
  res.status(StatusCode.OK).send(blocks);
};

const getCoachById = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { id } = req.params;
  if (!id) {
    next(ApiError.missingFields(['id']));
  }

  const coach = await getCoach(id);
  if (!coach) {
    next(ApiError.notFound('Coach not found'));
    return;
  }
  res.status(StatusCode.OK).send(coach);
};

export {
  getAllCoaches,
  createCoach,
  updateCoachAttendance,
  createCoachAttendanceByDate,
  deleteCoachAttendanceByDate,
  getCoachBlocksById,
  getStudentFromCoachById,
  getCoachById,
};
