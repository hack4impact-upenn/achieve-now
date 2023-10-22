/**
 * All the functions for interacting with student data in the MongoDB database
 */
import { Student } from '../models/student.model';
import { Resource } from '../models/resource.model';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const passwordHashSaltRounds = 10;
const removeSensitiveDataQuery = [
  '-password',
  '-verificationToken',
  '-resetPasswordToken',
  '-resetPasswordTokenExpiryDate',
];

/**
 * @returns All the {@link Student}s in the database without their passwords.
 */
const getAllStudentsFromDB = async () => {
  const userList = await Student.find({})
    .select(removeSensitiveDataQuery)
    .exec();
  return userList;
};

/**
 * Gets a student from the database by their id.
 * @param id The id of the user to get.
 * @returns The {@link Student} or null if the student was not found.
 */
const getStudentByID = async (id: string) => {
  const user = await Student.findOne({ id })
    .select(removeSensitiveDataQuery)
    .exec();
  return user;
};

/**
 * Gets a resource from the database by its id.
 * @param id The id of the resource to get.
 * @returns The {@link Resource} or null if the user was not found.
 */
const getResourceByID = async (id: string) => {
  const user = await Resource.findById(id)
    .select(removeSensitiveDataQuery)
    .exec();
  return user;
};

/**
 * A function that updates a student's resources
 * @param id The id of the user to delete.
 * @returns The updated {@link Student}
 */
const updateResourcesByID = async (id: string, resources: string[]) => {
  const student = await Student.findOneAndUpdate({ id }, [
    { $set: { parent_additional_resources: resources } },
  ]).exec();
  return student;
};

const createStudent = async (
  userId: string,
  parentName: string,
  parentCommunicationTimes: string,
  parentCommunicationDays: string,
  bestCommunicationMethod: string,
  personality: string,
) => {
  const newStudent = new Student({
    user_id: userId,
    parent_name: parentName,
    parent_communication_times: parentCommunicationTimes,
    parent_communication_days: parentCommunicationDays,
    best_communication_method: bestCommunicationMethod,
    personality,
  });
  const student = await newStudent.save();
  return student;
};

/**
 * A function that updates a student's attendance
 * @param id: The id of the student to update
 * @param date: The timestamp of the date to update attendance for
 * @param attendance: The new attendance of the student
 * @returns The updated {@link Student}
 */
const updateAttendance = async (
  id: string,
  date: number,
  attendance: string,
) => {
  const student = await Student.findOneAndUpdate(
    {
      _id: id,
    },
    {
      $set: { [`progress_stats.attendance.${date}`]: attendance },
    },
  ).exec();
  return student;
};

/**
 * A function that creates attendance for all students on a given date
 * @param date: The timestamp of the date to create attendance for
 */
const createAttendanceOnDate = async (date: number) => {
  await Student.updateMany(
    {},
    {
      $set: {
        [`progress_stats.attendance.${date}`]: '',
      },
    },
  );
};

/**
 * A function that deletes attendance for all students on a given date
 * @param date: The timestamp of the date to delete attendance for
 */
const deleteAttendanceOnDate = async (date: number) => {
  await Student.updateMany(
    {},
    {
      $unset: {
        [`progress_stats.attendance.${date}`]: 1,
      },
    },
  );
};

export {
  passwordHashSaltRounds,
  getStudentByID,
  getResourceByID,
  updateResourcesByID,
  getAllStudentsFromDB,
  createStudent,
  updateAttendance,
  createAttendanceOnDate,
  deleteAttendanceOnDate,
};
