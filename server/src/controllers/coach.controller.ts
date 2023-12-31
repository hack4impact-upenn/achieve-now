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
  updateCoach,
  getCoachByUser,
  updateProgressDate,
  deleteProgressDate,
} from '../services/coach.service';
import StatusCode from '../util/statusCode';
import { IStudent } from '../models/student.model';
import { getLessonById } from '../services/lesson.service';
import { getResourceByID } from '../services/student.service';

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

const getCoachByUserId = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { id } = req.params;
  if (!id) {
    next(ApiError.missingFields(['id']));
  }
  const coach = await getCoachByUser(id);
  if (!coach) {
    next(ApiError.notFound('Coach not found'));
    return;
  }
  res.status(StatusCode.OK).send(coach);
};

const putCoach = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { id } = req.params;
  const coach = req.body;

  if (!id || !coach) {
    next(ApiError.missingFields(['id', 'coach']));
  }

  const newCoach = await updateCoach(id, coach);
  if (!coach) {
    next(ApiError.notFound('Coach not found'));
    return;
  }
  res.status(StatusCode.OK).send(newCoach);
};

const updateProgress = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { id } = req.params;
  if (!id) {
    next(ApiError.missingFields(['id']));
  }

  const { date } = req.body;
  if (!date) {
    next(ApiError.missingFields(['date']));
  }
  const { observations } = req.body || '';
  const { next_steps } = req.body || '';

  const coach = await updateProgressDate(id, date, observations, next_steps);
  res.status(StatusCode.OK).send(coach);
};

const deleteProgress = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { id, date } = req.params;
  if (!id) {
    next(ApiError.missingFields(['id']));
  }
  if (!date) {
    next(ApiError.missingFields(['date']));
  }

  const coach = await deleteProgressDate(id, date);
  res.status(StatusCode.OK).send(coach);
};

/**
 * Get all resources for a given coach id for their student including their lesson resources
 */
const getAllCoachResources = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { id } = req.params;
  if (!id) {
    next(ApiError.missingFields(['id']));
    return;
  }

  const coach = await getCoachByUser(id);
  if (!coach) {
    next(ApiError.notFound(`Coach with id ${id} does not exist`));
    return;
  }

  const student: IStudent | null = await getStudentFromCoach(coach?._id);
  if (!student) {
    next(
      ApiError.notFound(`Coach with id ${id} is not connected to any students`),
    );
    return;
  }

  const lesson = await getLessonById(student.lesson_level);
  if (!lesson) {
    next(
      ApiError.notFound(
        `Lesson with id ${student.lesson_level} does not exist`,
      ),
    );
    return;
  }

  const coachPromises = lesson.coach_resources.map((resource_id: string) =>
    getResourceByID(resource_id.toString()),
  );
  Promise.all(coachPromises)
    .then((resources) => {
      if (!student.coach_additional_resources) {
        const responseObj = {
          lesson_level: lesson.number,
          resources,
          additional_resources: [],
        };
        res.status(StatusCode.OK).send(responseObj);
      } else {
        const addPromises = student.coach_additional_resources.map(
          (resource_id) => getResourceByID(resource_id.toString()),
        );
        Promise.all(addPromises)
          .then((addResources) => {
            const responseObj = {
              lesson_level: lesson.number,
              resources,
              additional_resources: addResources,
            };
            res.status(StatusCode.OK).send(responseObj);
          })
          .catch((err) => {
            console.log(err);
            next(
              ApiError.internal(
                'Unable to retrieve additional coach resources',
              ),
            );
          });
      }
    })
    .catch((err) => {
      console.log(err);
      next(ApiError.internal('Unable to retrieve coach resources'));
    });
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
  getCoachByUserId,
  putCoach,
  updateProgress,
  deleteProgress,
  getAllCoachResources,
};
