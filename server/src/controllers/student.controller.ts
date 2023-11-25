/* eslint-disable camelcase */
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
  updateParentResourcesByID,
  getAllStudentsFromDB,
  updateCoachResourcesByID,
  updateAttendance,
  deleteAttendanceOnDate,
  createAttendanceOnDate,
  addCoachToStudent,
  updateProgressDate,
  deleteProgressDate,
} from '../services/student.service';
import { getLessonById } from '../services/lesson.service';
import { getUserById } from '../services/user.service';

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
        // console.log(studentList.filter((student) => hasTeacher(student)));
        return studentList;
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
 * Get all students and for each student, all of their information including from
 * the user object and their lesson number.
 */
const getAllStudentsWithUserLesson = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const students = await getAllStudentsFromDB();
  const lessonPromises = students.map((student) =>
    getLessonById(student.lesson_level),
  );
  const userPromises: any = students.map((student) =>
    getUserById(student.user_id),
  );
  Promise.all(lessonPromises)
    .then((lessons) => {
      Promise.all(userPromises)
        .then((users) => {
          const response = students.map((student, index) => {
            const user = users[index];
            const lesson = lessons[index];
            return {
              studentId: student._id,
              firstName: user?.firstName,
              lastName: user?.lastName,
              lessonNumber: lesson?.number,
            };
          });
          res.status(StatusCode.OK).send(response);
        })
        .catch((err) => {
          console.log(err);
          next(ApiError.internal('Unable to retrieve users'));
        });
    })
    .catch((err) => {
      console.log(err);
      next(ApiError.internal('Unable to retrieve lessons'));
    });
};

/**
 * Get all additional resources for a particular student based on the
 * Send a 200 OK status code on success.
 */
const getAdditionalStudentResources = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { id } = req.params;
  const { role } = req.body;
  if (!id) {
    next(ApiError.missingFields(['id']));
    return;
  }

  const student: IStudent | null = await getStudentByID(id);
  if (!student) {
    next(ApiError.notFound(`Student with id ${id} does not exist`));
    return;
  }

  if (role === 'coach' && student.coach_additional_resources) {
    const coachPromises: any = student.coach_additional_resources.map(
      (resource_id) => getResourceByID(resource_id),
    );
    Promise.all(coachPromises)
      .then((resources) => {
        if (!resources) {
          next(ApiError.notFound(`Student does not have any coach resources.`));
          return;
        }
        res.status(StatusCode.OK).send(resources);
      })
      .catch((err) => {
        console.log(err);
        next(ApiError.internal('Unable to retrieve coach resources'));
      });
  } else if (role === 'parent' && student.parent_additional_resources) {
    const parentPromises = student.parent_additional_resources.map(
      (resource_id) => getResourceByID(resource_id),
    );
    Promise.all(parentPromises)
      .then((resources) => {
        res.status(StatusCode.OK).send(resources);
      })
      .catch((err) => {
        console.log(err);
        next(ApiError.internal('Unable to retrieve parent resources'));
      });
  } else {
    next(ApiError.notFound(`Student does not have any ${role} resources.`));
  }
};

/**
 * Get all resources for a given student id including their lesson resources
 */
const getAllStudentResources = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { id } = req.params;
  const { role } = req.body;
  if (!id) {
    next(ApiError.missingFields(['id']));
    return;
  }
  if (!role) {
    next(ApiError.missingFields(['role']));
    return;
  }

  const student: IStudent | null = await getStudentByID(id);
  if (!student) {
    next(ApiError.notFound(`Student with id ${id} does not exist`));
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

  try {
    if (role === 'coach') {
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
    } else if (role === 'parent') {
      const studentPromises = lesson.parent_resources.map(
        (resource_id: string) => getResourceByID(resource_id.toString()),
      );
      Promise.all(studentPromises)
        .then((resources) => {
          if (!student.parent_additional_resources) {
            const responseObj = {
              lesson_level: lesson.number,
              resources,
              additional_resources: [],
            };
            res.status(StatusCode.OK).send(responseObj);
          } else {
            const addPromises: any[] = student.parent_additional_resources.map(
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
                    'Unable to retrieve additional parent resources',
                  ),
                );
              });
          }
        })
        .catch((err) => {
          console.log(err);
          next(ApiError.internal('Unable to retrieve parent resources'));
        });
    } else {
      next(ApiError.internal('Invalid role'));
    }
  } catch (err) {
    console.log(err);
    next(ApiError.internal('Unable to retrieve resources'));
  }
};

/**
 * Delete resource for a particular student. Send a 200 OK status code on success.
 */
const deleteResource = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { id, resource, role } = req.body;

  if (!id) {
    next(ApiError.missingFields(['id']));
    return;
  }
  if (!resource) {
    next(ApiError.missingFields(['resource']));
    return;
  }
  if (!role) {
    next(ApiError.missingFields(['role']));
    return;
  }

  // Check if student exists
  const student: IStudent | null = await getStudentByID(id);
  if (!student) {
    next(ApiError.notFound(`Student with id ${id} does not exist`));
    return;
  }

  if (role === 'parent') {
    if (!student.parent_additional_resources) {
      next(ApiError.notFound(`Student does not have any parent resources.`));
      return;
    }

    const updated_resources = student.parent_additional_resources.filter(
      (item) => item.toString() !== resource.toString(),
    );

    updateParentResourcesByID(id, updated_resources)
      .then((studentRes: any) => res.status(StatusCode.OK).send(studentRes))
      .catch((e: any) => {
        console.log(e);
        next(ApiError.internal('Failed to delete resource.'));
      });
  } else if (role === 'coach') {
    if (!student.coach_additional_resources) {
      next(ApiError.notFound(`Student does not have any coach resources.`));
      return;
    }

    const updated_resources = student.coach_additional_resources.filter(
      (item) => item.toString() !== resource.toString(),
    );

    updateCoachResourcesByID(id, updated_resources)
      .then((studentRes) => res.status(StatusCode.OK).send(studentRes))
      .catch((e: any) => {
        console.log(e);
        next(ApiError.internal('Failed to delete resource.'));
      });
  }
};

/**
 * Update student resource (add specified).
 */
const addResource = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { id, resource, role } = req.body;
  if (!id) {
    next(ApiError.missingFields(['id']));
    return;
  }
  if (!resource) {
    next(ApiError.missingFields(['resource']));
    return;
  }
  if (!role) {
    next(ApiError.missingFields(['role']));
    return;
  }

  // Check if student exists
  const student: IStudent | null = await getStudentByID(id);
  if (!student) {
    next(ApiError.notFound(`Student with id ${id} does not exist`));
    return;
  }

  let resources: string[] = [];

  if (role === 'parent' && student.parent_additional_resources) {
    resources = student.parent_additional_resources;
  } else if (role === 'coach' && student.coach_additional_resources) {
    resources = student.coach_additional_resources;
  }

  resources.push(resource);

  if (role === 'parent') {
    updateParentResourcesByID(id, resources)
      .then((response) => res.status(StatusCode.OK).send(response))
      .catch((e: any) => {
        console.log(e);
        next(ApiError.internal('Failed to add resource.'));
      });
  } else if (role === 'coach') {
    updateCoachResourcesByID(id, resources)
      .then((response) => res.status(StatusCode.OK).send(response))
      .catch((e: any) => {
        console.log(e);
        next(ApiError.internal('Failed to add resource.'));
      });
  } else {
    next(ApiError.internal('Invalid role.'));
  }
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

export {
  getStudentsFromTeacherId,
  getStudent,
  getAllStudentsWithUserLesson,
  getAllStudentResources,
  getAdditionalStudentResources,
  deleteResource,
  addResource,
  getAllStudents,
  updateStudentAttendance,
  createStudentAttendanceByDate,
  deleteStudentAttendanceByDate,
  addCoach,
  updateProgress,
  deleteProgress,
};
