/**
 * All the controller functions containing the logic for routes relating to
 * admin users such as getting all users, deleting users and upgrading users.
 */
import express from 'express';
import ApiError from '../util/apiError';
import StatusCode from '../util/statusCode';
import {
  getAllStudentsFromDB,
  getStudentByID,
} from '../services/student.service';
import { IStudent } from '../models/student.model';

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

  function hasTeacher(student: IStudent) {
    const teachers = student.teacher_id;
    for (let i = 0; i < teachers.length; i++) {
      const teacher = teachers[i];
      if (teacher === id) {
        return true;
      }
    }
    return false;
  }

  return (
    getAllStudentsFromDB()
      .then((studentList) => {
        console.log('made it');
        //console.log(studentList.filter((student) => hasTeacher(student)));
        return studentList;
      })
      .then((filteredList) => {
        console.log('made it to filtered');
        res.status(StatusCode.OK).send(filteredList);
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch((e) => {
        next(ApiError.internal('Unable to retrieve all users'));
      })
  );
};

// get a specific student
const getStudent = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { id } = req.params;
  if (!id) {
    next(ApiError.internal('Request must include a valid student id param'));
  }

  return (
    getStudentByID(id)
      .then((user) => {
        res.status(StatusCode.OK).send(user);
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch((e) => {
        next(ApiError.internal('Unable to retrieve specified student'));
      })
  );
};

export { getStudentsFromTeacherId, getStudent };
