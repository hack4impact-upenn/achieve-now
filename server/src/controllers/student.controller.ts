/**
 * All the controller functions containing the logic for routes relating to
 * admin users such as getting all users, deleting users and upgrading users.
 */
import express from 'express';
import ApiError from '../util/apiError';
import StatusCode from '../util/statusCode';
import { getAllStudentsFromDB } from '../services/student.service';

/**
 * Get students by teacher_id
 */
const getStudentsFromTeacherId = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { id } = req.params;

  if (!id) {
    next(ApiError.internal('Request must include a valid teacher_id param'));
  }

  return (
    getAllStudentsFromDB()
      .then((studentList) => {
        return studentList.filter((student) => student.teacher_id === id);
      })
      .then((filteredList) => {
        res.status(StatusCode.OK).send(filteredList);
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch((e) => {
        next(ApiError.internal('Unable to retrieve all users'));
      })
  );
};

export { getStudentsFromTeacherId };
