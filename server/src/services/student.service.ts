/* eslint-disable camelcase */
/**
 * All the functions for interacting with student data in the MongoDB database
 */
import { IStudent, Student } from '../models/student.model';
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

const deleteResourceByID = async (
  student: IStudent,
  resourceId: string,
  role: string,
) => {
  try {
    if (role === 'parent') {
      await Student.updateOne(
        { _id: student._id },
        { $pull: { parent_additional_resources: resourceId } },
      ).exec();
    } else if (role === 'coach') {
      await Student.updateOne(
        { _id: student._id },
        { $pull: { coach_additional_resources: resourceId } },
      ).exec();
    } else {
      throw new Error('Invalid role specified');
    }

    // Fetch and return the updated lesson object
    const updatedStudent = await Student.findById(student._id).exec();
    return updatedStudent;
  } catch (error) {
    console.log('Error updating resources in lesson:', error);
    throw error; // Propagate the error
  }
};

const addResourceByID = async (
  student: IStudent,
  resourceId: string,
  role: string,
) => {
  try {
    if (role === 'parent') {
      await Student.updateOne(
        { _id: student._id },
        { $addToSet: { parent_additional_resources: resourceId } },
      ).exec();
    } else if (role === 'coach') {
      await Student.updateOne(
        { _id: student._id },
        { $addToSet: { coach_additional_resources: resourceId } },
      ).exec();
    } else {
      throw new Error('Invalid role specified');
    }

    // Fetch and return the updated student object
    const updatedStudent = await Student.findById(student._id).exec();
    return updatedStudent;
  } catch (error) {
    console.log('Error updating resources in lesson:', error);
    throw error; // Propagate the error
  }
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

/**
 * A function that updates student info in the database.
 * @param id The id of the user to update.
 * @returns The updated {@link Student}
 */
const updateStudentInfo = async (
  id: string,
  school: string,
  teacher: string,
  lessonLevel: string,
  grade: number,
  parentName: string,
  bestDay: string,
  bestTime: string,
  contactMethod: string,
  mediaWaiver: boolean,
  adminUpdates: string,
  workHabits: string,
  personality: string,
  family: string,
  favFood: string,
  likes: string,
  dislikes: string,
  motivation: string,
  goodStrategies: string,
  badStrategies: string,
  badges: string[],
  risingReadersScore: any,
  generalProgramScore: any,
  progressFlag: boolean,
  attendanceFlag: boolean,
) => {
  const student = await Student.findByIdAndUpdate(
    id,
    {
      school_id: school,
      teacher_id: teacher,
      lesson_level: lessonLevel === '' ? undefined : lessonLevel,
      grade,
      parent_name: parentName,
      parent_communication_days: bestDay,
      parent_communication_times: bestTime,
      best_communication_method: contactMethod,
      media_waiver: mediaWaiver,
      admin_updates: adminUpdates,
      work_habits: workHabits,
      personality,
      family,
      fav_food: favFood,
      likes,
      dislikes,
      motivation,
      good_strategies: goodStrategies,
      bad_strategies: badStrategies,
      badges,
      risingReadersScore: [risingReadersScore.start, risingReadersScore.mid],
      generalProgramScore: [generalProgramScore.start, generalProgramScore.mid],
      progressFlag,
      attendanceFlag,
    },
    { new: true },
  ).exec();
  return student;
};

const addCoachToStudent = async (student_id: string, coach_id: string) => {
  const student = await Student.findByIdAndUpdate(
    student_id,
    { $set: { coach_id: [coach_id] } },
    { new: true },
  );
  return student;
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
  getAllStudentsFromDB,
  createStudent,
  updateAttendance,
  createAttendanceOnDate,
  deleteAttendanceOnDate,
  addCoachToStudent,
  updateProgressDate,
  deleteProgressDate,
  deleteResourceByID,
  addResourceByID,
  updateStudentInfo,
};
