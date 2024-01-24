/**
 * All the controller functions containing the logic for routes relating to
 * admin users such as getting all users, deleting users and upgrading users.
 */
import express from 'express';
import ApiError from '../util/apiError';
import StatusCode from '../util/statusCode';
import {
  getUserById,
  getAllTeachersFromDB,
  updateUser,
  getUserIdByEmail,
} from '../services/user.service';
import { getStudentByUserId } from '../services/student.service';
import { getCoachByUser, getStudentFromCoach } from '../services/coach.service';
import { IStudent } from '../models/student.model';

// get a specific user by id
const getUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { id } = req.params;
  if (!id) {
    next(ApiError.internal('Request must include a valid userID param'));
  }

  return (
    getUserById(id)
      .then((user) => {
        res.status(StatusCode.OK).send(user);
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch((e) => {
        next(ApiError.internal('Unable to retrieve specified user'));
      })
  );
};

const getAllTeachers = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  return getAllTeachersFromDB()
    .then((teacherList) => {
      res.status(StatusCode.OK).send(teacherList);
    })
    .catch((e) => {
      console.log(e);
      next(ApiError.internal('Unable to retrieve all teachers'));
    });
};

const putUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { id } = req.params;
  const user = req.body;

  if (!id || !user) {
    next(ApiError.internal('Request must include a valid userID param'));
  }
  return (
    updateUser(id, user)
      .then((newUser) => {
        res.status(StatusCode.OK).send(newUser);
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch((e) => {
        next(ApiError.internal('Unable to retrieve specified user'));
      })
  );
};

const getUserEmail = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { email } = req.params;
  if (!email) {
    next(ApiError.internal('Request must include a valid email param'));
  }

  return (
    getUserIdByEmail(email)
      .then((id: any) => {
        res.status(StatusCode.OK).send(id);
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch((e: any) => {
        next(ApiError.internal('Unable to retrieve specified user'));
      })
  );
};

const getStudent = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { id } = req.params;
  if (!id) {
    next(ApiError.internal('Request must include a valid userID param'));
  }

  return (
    getStudentByUserId(id)
      .then((student) => {
        res.status(StatusCode.OK).send(student);
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch((e) => {
        next(ApiError.internal('Unable to retrieve specified user'));
      })
  );
};

const getCoach = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { id } = req.params;
  if (!id) {
    next(ApiError.internal('Request must include a valid userID parameter'));
  }

  return (
    getCoachByUser(id)
      .then((coach) => {
        if (!coach) {
          next(ApiError.internal('Unable to retrieve specified Coach'));
          return;
        }
        getStudentFromCoach(coach._id)
          .then((student: IStudent) => {
            res.status(StatusCode.OK).send(student);
          })
          .catch((e) => {
            console.log(e);
            next(ApiError.internal('Unable to retrieve specified Student'));
          });
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch((e) => {
        next(ApiError.internal('Unable to retrieve specified user'));
      })
  );
};

export { getUser, getAllTeachers, putUser, getUserEmail, getStudent, getCoach };
