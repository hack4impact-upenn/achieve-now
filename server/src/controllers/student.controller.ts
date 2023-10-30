/**
 * All the controller functions containing the logic for routes relating to
 * student users.
 */
import express from 'express';
import ApiError from '../util/apiError';
import StatusCode from '../util/statusCode';
import { IStudent } from '../models/student.model';
import {
  getStudentByID,
  getResourceByID,
  updateResourcesByID,
  getAllStudentsFromDB,
  updateAttendance,
  deleteAttendanceOnDate,
  createAttendanceOnDate,
  addCoachToStudent,
} from '../services/student.service';

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function hasTeacher(student: IStudent) {
    const teachers = student.teacher_id;
    for (let i = 0; i < teachers.length; i += 1) {
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
        // console.log(studentList.filter((student) => hasTeacher(student)));
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

/**
 * Get all students from the database. Upon success, send the a list of all students in the res body with 200 OK status code.
 */
const getAllStudents = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  return (
    getAllStudentsFromDB()
      .then((userList) => {
        res.status(StatusCode.OK).send(userList);
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch((e) => {
        next(ApiError.internal('Unable to retrieve all users'));
      })
  );
};

/**
 * Get resources for a particular student. Send a 200 OK status code on success.
 */
const getStudentResources = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { id } = req.params;
  if (!id) {
    next(ApiError.missingFields(['id']));
    return;
  }

  const student: IStudent | null = await getStudentByID(id);
  if (!student) {
    next(ApiError.notFound(`Student with id ${id} does not exist`));
    return;
  }

  const resources = [];

  if (student.parent_additional_resources) {
    for (let i = 0; i < student.parent_additional_resources.length; i++) {
      const resource_id = student.parent_additional_resources[i];
      const res = await getResourceByID(resource_id);
      resources.push(res);
    }
  }

  res.status(StatusCode.OK).send(resources);
};

/**
 * Delete resource for a particular student. Send a 200 OK status code on success.
 */
const deleteResource = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { id } = req.body;
  const { resource } = req.body;

  console.log('DELETION');
  console.log(id);
  console.log(resource);
  if (!id) {
    // next(ApiError.missingFields(['id']));
    return;
  }

  if (!resource) {
    // next(ApiError.missingFields(['resource']));
    return;
  }

  // Check if student exists
  const student: IStudent | null = await getStudentByID(id);
  if (!student) {
    next(ApiError.notFound(`Student with id ${id} does not exist`));
    return;
  }
  if (!student.parent_additional_resources) {
    next(ApiError.notFound(`Student does not have any resources.`));
    return;
  }

  const updated_resources = student.parent_additional_resources.filter(
    (item) => item !== resource,
  );

  console.log(`updated: ${updated_resources}`);

  updateResourcesByID(id, updated_resources)
    .then((student) => res.status(StatusCode.OK).send(student))
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .catch((e) => {
      next(ApiError.internal('Failed to delete resource.'));
    });
};

/**
 * Update student resource (add specified).
 */
const updateResource = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { id } = req.body;
  const { resource } = req.body;
  if (!id) {
    next(ApiError.missingFields(['id']));
    return;
  }
  if (!resource) {
    next(ApiError.missingFields(['resource']));
    return;
  }

  // Check if student exists
  const student: IStudent | null = await getStudentByID(id);
  if (!student) {
    next(ApiError.notFound(`Student with id ${id} does not exist`));
    return;
  }

  let resources = [];

  if (student.parent_additional_resources) {
    resources = student.parent_additional_resources;
  } else {
    resources.push('');
  }
  console.log(`original: ${resources}`);
  const student_id = student._id;

  resources.push(resource);

  const updated_resources = resources.filter((item) => item !== '');

  console.log(`updated: ${updated_resources}`);

  updateResourcesByID(id, updated_resources)
    .then(() => res.sendStatus(StatusCode.OK))
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .catch((e) => {
      next(ApiError.internal('Failed to add resource.'));
    });
};

const updateStudentAttendance = async (
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

  const student = updateAttendance(id, date, attendance);
  res.status(StatusCode.OK).send(student);
};

const createStudentAttendanceByDate = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { date } = req.body;
  if (!date) {
    next(ApiError.missingFields(['date']));
    return;
  }

  const student = createAttendanceOnDate(date);
  res.status(StatusCode.OK).send(student);
};

const deleteStudentAttendanceByDate = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { date } = req.body;
  if (!date) {
    next(ApiError.missingFields(['date']));
    return;
  }

  const student = deleteAttendanceOnDate(date);
  res.status(StatusCode.OK).send(student);
};

const addCoach = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { student_id, coach_id } = req.body;
  if (!student_id) {
    next(ApiError.missingFields(['student_id']));
    return;
  }
  if (!coach_id) {
    next(ApiError.missingFields(['coach_id']));
    return;
  }
  addCoachToStudent(student_id, coach_id)
    .then((student) => res.status(StatusCode.OK).send(student))
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .catch((e) => {
      next(ApiError.internal(e));
    });
};

export {
  getStudentsFromTeacherId,
  getStudent,
  getStudentResources,
  deleteResource,
  updateResource,
  getAllStudents,
  updateStudentAttendance,
  createStudentAttendanceByDate,
  deleteStudentAttendanceByDate,
  addCoach,
};
