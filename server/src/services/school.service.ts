/**
 * All the functions for interacting with user data in the MongoDB database
 */
/* eslint-disable camelcase */
import { School } from '../models/school.model';

const passwordHashSaltRounds = 10;
const removeSensitiveDataQuery = [
  '-password',
  '-verificationToken',
  '-resetPasswordToken',
  '-resetPasswordTokenExpiryDate',
];
/**
 * Creates a new user in the database.
 * @param firstName - string representing the first name of the user
 * @param lastName - string representing the last name of the user
 * @param email - string representing the email of the user
 * @param password - string representing the password of the user
 * @param role - string representing the role of the user
 * @returns The created {@link User}
 */
const createSchoolInDB = async (
  name: string,
  teachers: [string],
  info: string,
  admin_name: string,
  admin_content: string,
  calendar_link: string,
  school_start_time: Date,
  school_end_time: Date,
  first_grade_lunch_start_time: Date,
  first_grade_lunch_end_time: Date,
  second_grade_lunch_start_time: Date,
  second_grade_lunch_end_time: Date,
) => {
  const newSchool = new School({
    name,
    teachers,
    info,
    admin_name,
    admin_content,
    calendar_link,
    school_start_time,
    school_end_time,
    first_grade_lunch_start_time,
    first_grade_lunch_end_time,
    second_grade_lunch_start_time,
    second_grade_lunch_end_time,
  });
  const school = await newSchool.save();
  return school;
};

/**
 * @returns All the {@link Schools}s in the database without their passwords.
 */
const getAllSchoolsInDB = async () => {
  const schoolList = await School.find({})
    .select(removeSensitiveDataQuery)
    .exec();
  return schoolList;
};

/**
 * A function that updates a school's attendance
 * @param id: The id of the school to query
 * @returns The updated {@link School}
 */
const getSchoolByIdInDB = async (id: string) => {
  const school = await School.findById(id);
  return school;
};

/**
 * A function that deletes a user from the database.
 * @param id The id of the user to delete.
 * @returns The deleted {@link User}
 */
const deleteSchoolById = async (id: string) => {
  const school = await School.findByIdAndDelete(id).exec();
  return school;
};

const updateSchoolById = async (
  id: string,
  name: string,
  teachers: [string],
  info: string,
  admin_name: string,
  admin_content: string,
  calendar_link: string,
  school_start_time: Date,
  school_end_time: Date,
  first_grade_lunch_start_time: Date,
  first_grade_lunch_end_time: Date,
  second_grade_lunch_start_time: Date,
  second_grade_lunch_end_time: Date,
) => {
  const updatedSchool = await School.findByIdAndUpdate(
    id,
    {
      name,
      teachers,
      info,
      admin_name,
      admin_content,
      calendar_link,
      school_start_time,
      school_end_time,
      first_grade_lunch_start_time,
      first_grade_lunch_end_time,
      second_grade_lunch_start_time,
      second_grade_lunch_end_time,
    },
    { new: true },
  ).exec();

  return updatedSchool;
};

export {
  passwordHashSaltRounds,
  createSchoolInDB,
  getAllSchoolsInDB,
  getSchoolByIdInDB,
  deleteSchoolById,
  updateSchoolById,
};
