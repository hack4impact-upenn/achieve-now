/* eslint-disable camelcase */
/**
 * All the controller functions containing the logic for routes relating to
 * student users.
 */
import express from 'express';
import crypto from 'crypto';
import ApiError from '../util/apiError';
import StatusCode from '../util/statusCode';
import { IStudent } from '../models/student.model';
import {
  getStudentByID,
  getResourceByID,
  getAllStudentsFromDB,
  updateAttendance,
  deleteAttendanceOnDate,
  createAttendanceOnDate,
  updateStudentInfo,
  addCoachToStudent,
  deleteProgressDate,
  deleteResourceByID,
  addResourceByID,
  updateProgressDate,
  updateLessonLevel,
  getStudentByUserId,
} from '../services/student.service';
import {
  getAllUsersFromDB,
  getUserByEmail,
  getUserById,
  updateUserInfo,
} from '../services/user.service';
import { IInvite } from '../models/invite.model';
import { IUser } from '../models/user.model';
import {
  getInviteByEmail,
  updateInvite,
  createInvite,
} from '../services/invite.service';
import { emailInviteLink } from '../services/mail.service';
import { getLessonById } from '../services/lesson.service';

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
 * Update student resource (add specified).
 */
const updateStudentInformation = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { id } = req.params;
  const {
    school,
    teacher,
    lessonLevel,
    grade,
    phone,
    email,
    parentName,
    bestDay,
    bestTime,
    contactMethod,
    mediaWaiver,
    adminUpdates,
    workHabits,
    personality,
    family,
    favFood,
    likes,
    dislikes,
    motivation,
    goodStrategies,
    badStrategies,
    badges,
    risingReadersScore,
    generalProgramScore,
    progressFlag,
    attendanceFlag,
  } = req.body;

  if (!id) {
    next(ApiError.missingFields(['id']));
    return;
  }

  //   if (
  //     !school ||
  //     !teacher ||
  //     !lessonLevel ||
  //     !grade ||
  //     !phone ||
  //     !email ||
  //     !parentName ||
  //     !bestDay ||
  //     !bestTime ||
  //     !contactMethod ||
  //     !mediaWaiver ||
  //     !adminUpdates ||
  //     !workHabits ||
  //     !personality ||
  //     !family ||
  //     !favFood ||
  //     !likes ||
  //     !dislikes ||
  //     !motivation ||
  //     !goodStrategies ||
  //     !badStrategies ||
  //     !badges ||
  //     !risingReadersScore ||
  //     !generalProgramScore ||
  //     !progressFlag ||
  //     !attendanceFlag
  //   ) {
  //     next(
  //       ApiError.missingFields([
  //         'school',
  //         'teacher',
  //         'lessonLevel',
  //         'grade',
  //         'phone',
  //         'email',
  //         'parentName',
  //         'bestDay',
  //         'bestTime',
  //         'contactMethod',
  //         'mediaWaiver',
  //         'adminUpdates',
  //         'workHabits',
  //         'personality',
  //         'family',
  //         'favFood',
  //         'likes',
  //         'dislikes',
  //         'motivation',
  //         'goodStrategies',
  //         'badStrategies',
  //         'badges',
  //         'risingReadersScore',
  //         'generalProgramScore',
  //         'progressFlag',
  //         'attendanceFlag',
  //       ]),
  //     );
  //     return;
  //   }

  // Call the updateStudentInfo service function with the provided parameters
  const updatedStudent = await updateStudentInfo(
    id,
    school,
    teacher,
    lessonLevel,
    grade,
    parentName,
    bestDay,
    bestTime,
    contactMethod,
    mediaWaiver,
    adminUpdates,
    workHabits,
    personality,
    family,
    favFood,
    likes,
    dislikes,
    motivation,
    goodStrategies,
    badStrategies,
    badges,
    risingReadersScore,
    generalProgramScore,
    progressFlag,
    attendanceFlag,
  );

  if (!updatedStudent) {
    // If the update was unsuccessful, respond with an error
    next(ApiError.notFound('Unable to update student'));
    return;
  }

  const user = await getUserById(updatedStudent.user_id);
  if (!user) {
    next(ApiError.notFound('Unable to find user'));
    return;
  }

  const updatedUser = await updateUserInfo(
    updatedStudent.user_id,
    user.firstName,
    user.lastName,
    email,
    phone,
  );

  if (!updatedUser) {
    // If the update was unsuccessful, respond with an error
    next(ApiError.notFound('Unable to update user'));
    return;
  }
  res.status(StatusCode.OK).send();
};

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

const getStudentFromUserId = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { id } = req.params;
  if (!id) {
    next(ApiError.internal('Request must include a valid user id param'));
  }
  return getStudentByUserId(id)
    .then((user) => {
      if (!user) {
        next(ApiError.internal('Unable to retrieve specified student - 1'));
        return;
      }
      res.status(StatusCode.OK).send(user);
    })
    .catch((e) => {
      next(ApiError.internal('Unable to retrieve specified student - 3'));
    });
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

const getStudentsByTeacherID = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { email } = req.params;
  if (!email) {
    next(ApiError.internal('Request must include a valid teacher email param'));
  }
  return getUserByEmail(email)
    .then((user) => {
      getAllStudentsFromDB()
        .then((studentList) => {
          if (!user) {
            next(ApiError.internal('Unable to retrieve specified teacher'));
            return;
          }
          const newStudentList = studentList.filter((student) => {
            if (!student.teacher_id) {
              return false;
            }
            return student.teacher_id.includes(user._id);
          });
          const studentIdSet = new Set<string>();
          newStudentList.forEach((student) => {
            studentIdSet.add(student.user_id.toString());
          });
          getAllUsersFromDB()
            .then((studentUserList) => {
              const newStudentUserList: any = studentUserList
                .filter((studentUser) => {
                  if (!studentUser._id) {
                    return false;
                  }
                  return studentIdSet.has(studentUser._id.toString());
                })
                .sort((a, b) =>
                  a.firstName.toLowerCase() > b.firstName.toLowerCase()
                    ? 1
                    : -1,
                )
                .map((studentUser) => {
                  const student = studentList.find(
                    (other) =>
                      other.user_id.toString() === studentUser._id.toString(),
                  );
                  const temp: any = {
                    ...studentUser,
                  };
                  return {
                    ...temp._doc,
                    lesson_level: student?.lesson_level,
                  };
                });
              res.status(StatusCode.OK).send(newStudentUserList);
            })
            .catch((e) => {
              console.log(e);
              next(ApiError.internal('Unable to retrieve student in User'));
            });
        })
        .catch((e) => {
          console.log(e);
          next(ApiError.internal('Unable to retrieve students'));
        });
    })
    .catch((e) => {
      console.log(e);
      next(ApiError.internal('Unable to retrieve specified teacher'));
    });
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

  if (student.parent_additional_resources) {
    const resources = await Promise.all(
      student.parent_additional_resources.map(async (resourceId: string) => {
        getResourceByID(resourceId);
      }),
    );
    res.status(StatusCode.OK).send(resources);
  } else {
    res.status(StatusCode.OK).send([]);
  }
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
          const response = students
            .map((student, index) => {
              const user = users[index];
              const lesson = lessons[index];
              return {
                studentId: student._id,
                firstName: user?.firstName || '',
                lastName: user?.lastName || '',
                lessonNumber: lesson?.number,
              };
            })
            .sort((a, b) =>
              a.firstName.toLowerCase() > b.firstName.toLowerCase() ? 1 : -1,
            );
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

  const student: IStudent | null = await getStudentByUserId(id);
  if (!student) {
    next(ApiError.notFound(`Student with user_id ${id} does not exist`));
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

  const studentPromises = lesson.parent_resources.map((resource_id: string) =>
    getResourceByID(resource_id.toString()),
  );
  Promise.all(studentPromises).then((resources) => {
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
            ApiError.internal('Unable to retrieve additional parent resources'),
          );
        });
    }
  });
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

  deleteResourceByID(student, resource, role)
    .then((response) =>
      response
        ? res.status(StatusCode.OK).send(response)
        : res.sendStatus(StatusCode.NOT_FOUND),
    )
    .catch((e: any) => {
      console.log(e);
      next(ApiError.internal('Failed to delete resource.'));
    });
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

  const resourceObj = await getResourceByID(resource);
  if (!resourceObj) {
    next(ApiError.notFound(`Resource with id ${resource} does not exist`));
    return;
  }

  const response = await addResourceByID(student, resource, role);
  if (response) {
    res.status(StatusCode.OK).send(response);
    return;
  }
  res.sendStatus(StatusCode.NOT_FOUND);
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

const updateStudentLessonLevel = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { id, lessonLevel } = req.body;
  if (!id) {
    next(ApiError.missingFields(['id']));
    return;
  }
  if (!lessonLevel) {
    next(ApiError.missingFields(['lessonLzevel']));
    return;
  }
  const student = updateLessonLevel(id, lessonLevel);
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

const getStudentInformation = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { id } = req.params;
  if (!id) {
    next(ApiError.missingFields(['id']));
    return;
  }
  const student = await getStudentByID(id);
  if (!student) {
    next(ApiError.notFound(`Student with id ${id} does not exist`));
    return;
  }
  const user = await getUserById(student.user_id);
  if (!user) {
    next(ApiError.notFound(`User does not exist`));
  }
  const response = {
    student,
    user,
  };
  res.status(StatusCode.OK).send(response);
};

/**
 * Middleware to check if a user is an student using Passport Strategy
 * and creates an {@link ApiError} to pass on to error handlers if not
 */
const isTeacher = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  // Get User
  const user: IUser | null = req.user as IUser;
  // Check is user exists and is valid
  if (!user) {
    next(ApiError.unauthorized('Not a valid user.')); // TODO: see if this is the correct message
    return;
  }

  // Check if the user is an teacher
  if (user.role === 'teacher') {
    next();
  } else {
    next(ApiError.unauthorized('Is not a teacher.'));
  }
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
  getStudentFromUserId,
  getStudent,
  getStudentResources,
  getStudentsByTeacherID,
  getAllStudentsWithUserLesson,
  getAllStudentResources,
  getAdditionalStudentResources,
  deleteResource,
  addResource,
  getAllStudents,
  updateStudentAttendance,
  createStudentAttendanceByDate,
  deleteStudentAttendanceByDate,
  getStudentInformation,
  updateStudentInformation,
  addCoach,
  updateProgress,
  deleteProgress,
  isTeacher,
  updateStudentLessonLevel,
};
