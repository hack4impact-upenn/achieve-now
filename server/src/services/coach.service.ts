/* eslint-disable camelcase */
import { Coach, ICoach } from '../models/coach.model';
import { IStudent, Student } from '../models/student.model';
import { getAllBlocksfromDB } from './block.service';
import { IBlock } from '../models/block.model';

/**
 * @returns All the {@link Student}s in the database without their passwords.
 */
const getAllCoachesFromDB = async () => {
  const userList = await Coach.find({}).exec();
  return userList;
};

/**
 * createCoach creates a student in the database
 * @returns the newly created coach
 */
const createCoachInDB = async (
  userId: string,
  partnerSite: string,
  mailingAddress: string,
  mediaWaiver: boolean,
) => {
  const newCoach = new Coach({
    user_id: userId,
    partner_site: partnerSite,
    mailing_address: mailingAddress,
    media_waiver: mediaWaiver,
  });
  const coach = await newCoach.save();
  return coach;
};

const createCoachFromUser = async (userID: string) => {
  const newCoach = new Coach({
    user_id: userID,
  });
  const coach = await newCoach.save();
  return coach;
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
  const student = await Coach.findOneAndUpdate(
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
  await Coach.updateMany(
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
  await Coach.updateMany(
    {},
    {
      $unset: {
        [`progress_stats.attendance.${date}`]: 1,
      },
    },
  );
};

const getCoachBlocks = async (coach_id: string) => {
  const students = await Student.find({});
  const filteredStudents = students
    .filter(
      (student: IStudent) =>
        student.coach_id &&
        student.coach_id.includes &&
        student.coach_id.includes(coach_id),
    )
    .map((student: IStudent) => student._id.toString());

  const rawBlocks: IBlock[] = await getAllBlocksfromDB();
  const filteredBlocks = rawBlocks
    .filter((block: IBlock) =>
      block.students.some((student: string) =>
        filteredStudents.includes(student.toString()),
      ),
    )
    .map((block: IBlock) => block.name);

  return filteredBlocks;
};

const getStudentFromCoach = async (coach_id: string) => {
  const students = await Student.find({});
  const filteredStudents = students.filter(
    (student: IStudent) =>
      student.coach_id &&
      student.coach_id.includes &&
      student.coach_id.includes(coach_id),
  );
  return filteredStudents[0];
};

const getCoach = async (coach_id: string) => {
  const coach = await Coach.findOne({ _id: coach_id });
  return coach;
};

const updateCoach = async (id: string, coach: ICoach) => {
  return Coach.findByIdAndUpdate(id, coach, { new: true }).exec();
};

const getCoachByUser = async (user_id: string) => {
  // findOne by user_id isn't matching any coaches
  const coaches = await Coach.find();
  // eslint-disable-next-line eqeqeq
  const coach = coaches.find((c) => c.user_id == user_id);
  return coach;
};

const updateProgressDate = async (
  id: string,
  date: string,
  observations: string,
  next_steps: string,
) => {
  const coach = await Coach.findOneAndUpdate(
    {
      _id: id,
    },
    {
      $set: {
        [`progress_stats.coach_observations.${date}`]: observations,
        [`progress_stats.coach_next_steps.${date}`]: next_steps,
      },
    },
    { new: true },
  ).exec();
  return coach;
};

const deleteProgressDate = async (id: string, date: string) => {
  const coach = await Coach.findOneAndUpdate(
    {
      _id: id,
    },
    {
      $unset: {
        [`progress_stats.coach_observations.${date}`]: '',
        [`progress_stats.coach_next_steps.${date}`]: '',
      },
    },
    { new: true },
  ).exec();
  return coach;
};

export {
  getAllCoachesFromDB,
  createCoachFromUser,
  createCoachInDB,
  updateAttendance,
  createAttendanceOnDate,
  deleteAttendanceOnDate,
  getCoachBlocks,
  getStudentFromCoach,
  getCoach,
  updateCoach,
  getCoachByUser,
  updateProgressDate,
  deleteProgressDate,
};
