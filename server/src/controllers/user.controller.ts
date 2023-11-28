/**
 * All the controller functions containing the logic for routes relating to
 * admin users such as getting all users, deleting users and upgrading users.
 */
import express from 'express';
import ApiError from '../util/apiError';
import StatusCode from '../util/statusCode';
import { getUserById, getAllTeachersFromDB, updateUser } from '../services/user.service';

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
  console.log(id);
  console.log(user);
  return (
    updateUser(id, user)
      .then((user) => {
        res.status(StatusCode.OK).send(user);
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch((e) => {
        next(ApiError.internal('Unable to retrieve specified user'));
      })
  );
};

export { getUser, getAllTeachers, putUser };
