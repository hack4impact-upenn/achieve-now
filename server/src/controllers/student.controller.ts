import express from 'express';
import ApiError from '../util/apiError';
import StatusCode from '../util/statusCode';

import getStudentById from '../services/student.service';

const getStudent = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { id } = req.body;
  return (
    getStudentById(id)
      .then((student) => {
        res.status(StatusCode.OK).send(student);
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch((e) => {
        next(ApiError.internal('Unable to retrieve student'));
      })
  );
};

export default getStudent;
