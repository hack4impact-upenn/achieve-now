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
  try {
    const student = await Student.findById(id).exec();
    return student;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getStudentByUserId = async (user_id: string) => {
  try {
    const student = await Student.findOne({ user_id }).exec();
    return student;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Gets a resource from the database by its id.
 * @param id The id of the resource to get.
 * @returns The {@link Resource} or null if the user was not found.
 */
const getResourceByID = async (id: string) => {
  try {
    const resource = await Resource.findById(id).exec();
    return resource;
  } catch (error) {
    console.log(error);
    throw error;
  }
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
  try {
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
  } catch (error) {
    console.log(error);
    throw error;
  }
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
  try {
    const student = await Student.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: { [`progress_stats.attendance.${date}`]: attendance },
      },
    ).exec();
    return student;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * A function that updates a student's attendance
 * @param id: The id of the student to update
 * @param lessonLevel: The new lesson level of the student
 * @returns The updated {@link Student}
 */
const updateLessonLevel = async (id: string, lessonLevel: string) => {
  try {
    const student = await Student.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: { lesson_level: lessonLevel },
      },
    ).exec();
    return student;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * A function that creates attendance for all students on a given date
 * @param date: The timestamp of the date to create attendance for
 */
const createAttendanceOnDate = async (date: number) => {
  try {
    const students = await Student.updateMany(
      {},
      {
        $set: {
          [`progress_stats.attendance.${date}`]: '',
        },
      },
    );
    return students;
  } catch (error) {
    console.log(error);
    throw error;
  }
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
  lessonsCompleted: string[],
  risingReadersScore: any,
  generalProgramScore: any,
  progressFlag: boolean,
  attendanceFlag: boolean,
) => {
  try {
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
        lessonsCompleted,
        risingReadersScore: [risingReadersScore.start, risingReadersScore.mid],
        generalProgramScore: [
          generalProgramScore.start,
          generalProgramScore.mid,
        ],
        progressFlag,
        attendanceFlag,
      },
      { new: true },
    ).exec();
    return student;
  } catch (error) {
    const result = await Student.findById(id);
    return result;
  }
};

const addCoachToStudent = async (student_id: string, coach_id: string) => {
  try {
    const student = await Student.findByIdAndUpdate(
      student_id,
      { $set: { coach_id: [coach_id] } },
      { new: true },
    );
    return student;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateProgressDate = async (
  id: string,
  date: string,
  public_observations: string,
  public_next_steps: string,
  private_observations: string,
  private_next_steps: string,
) => {
  try {
    const student = await Student.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          [`progress_stats.public_student_observations.${date}`]:
            public_observations,
          [`progress_stats.public_student_next_steps.${date}`]:
            public_next_steps,
          [`progress_stats.private_student_observations.${date}`]:
            private_observations,
          [`progress_stats.private_student_next_steps.${date}`]:
            private_next_steps,
        },
      },
      { new: true },
    ).exec();
    return student;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteProgressDate = async (id: string, date: string) => {
  try {
    const coach = await Student.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $unset: {
          [`progress_stats.public_student_observations.${date}`]: '',
          [`progress_stats.public_student_next_steps.${date}`]: '',
          [`progress_stats.private_student_observations.${date}`]: '',
          [`progress_stats.private_student_next_steps.${date}`]: '',
        },
      },
      { new: true },
    ).exec();
    return coach;
  } catch (error) {
    console.log(error);
    throw error;
  }
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
  updateLessonLevel,
  getStudentByUserId,
};
