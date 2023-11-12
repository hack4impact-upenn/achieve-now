/**
 * All the functions for interacting with student data in the MongoDB database
 */
import { Student } from '../models/student.model';
import { Resource } from '../models/resource.model';

/**
 * @returns All the {@link Student}s in the database without their passwords.
 */
const getAllStudentsFromDB = async () => {
  const userList = await Student.find({}).exec();
  return userList;
};

/**
 * Gets a student from the database by their id.
 * @param id The id of the user to get.
 * @returns The {@link Student} or null if the student was not found.
 */
const getStudentByID = async (id: string) => {
  const student = await Student.findById(id).exec();
  return student;
};

/**
 * Gets a resource from the database by its id.
 * @param id The id of the resource to get.
 * @returns The {@link Resource} or null if the user was not found.
 */
const getResourceByID = async (id: string) => {
  const resource = await Resource.findById(id).exec();
  return resource;
};

/**
 * A function that updates a student's resources
 * @param id The id of the user to delete.
 * @returns The updated {@link Student}
 */
const updateParentResourcesByID = async (id: string, resources: string[]) => {
  const student = await Student.findOneAndUpdate({ id }, [
    { $set: { parent_additional_resources: resources } },
  ]).exec();
  return student;
};

const updateCoachResourcesByID = async (id: string, resources: string[]) => {
  const student = await Student.findOneAndUpdate({ id }, [
    { $set: { coach_additional_resources: resources } },
  ]).exec();
  return student;
};

const removeParentResourcesByID = async (id: string, resource: string) => {
  const student = await Student.findOneAndUpdate({ id }, [
    { $pull: { parent_additional_resources: resource } },
  ]).exec();
  return student;
};

const removeCoachResourcesByID = async (id: string, resource: string) => {
  const student = await Student.findOneAndUpdate({ id }, [
    { $pull: { coach_additional_resources: resource } },
  ]).exec();
  return student;
};

const addParentResourcesByID = async (id: string, resource: string) => {
  const student = await Student.findOneAndUpdate({ id }, [
    { $addToSet: { parent_additional_resources: resource } },
  ]).exec();
  return student;
};

const addCoachResourcesByID = async (id: string, resource: string) => {
  const student = await Student.findOneAndUpdate({ id }, [
    { $addToSet: { coach_additional_resources: resource } },
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

const updateProgressDate = async (
  id: string,
  date: string,
  observations: string,
  next_steps: string,
) => {
  const coach = await Student.findOneAndUpdate(
    {
      _id: id,
    },
    {
      $set: {
        [`progress_stats.student_observations.${date}`]: observations,
        [`progress_stats.student_next_steps.${date}`]: next_steps,
      },
    },
    { new: true },
  ).exec();
  return coach;
};

const deleteProgressDate = async (id: string, date: string) => {
  const coach = await Student.findOneAndUpdate(
    {
      _id: id,
    },
    {
      $unset: {
        [`progress_stats.student_observations.${date}`]: '',
        [`progress_stats.student_next_steps.${date}`]: '',
      },
    },
    { new: true },
  ).exec();
  return coach;
};

export {
  getStudentByID,
  getResourceByID,
  updateParentResourcesByID,
  updateCoachResourcesByID,
  removeParentResourcesByID,
  removeCoachResourcesByID,
  addParentResourcesByID,
  addCoachResourcesByID,
  getAllStudentsFromDB,
  createStudent,
  updateAttendance,
  createAttendanceOnDate,
  deleteAttendanceOnDate,
  updateProgressDate,
  deleteProgressDate,
};
