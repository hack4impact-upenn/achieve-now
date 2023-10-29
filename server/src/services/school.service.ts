/**
 * All the functions for interacting with user data in the MongoDB database
 */
import { hash } from 'bcrypt';
import { School } from '../models/school.model';

const passwordHashSaltRounds = 10;
const removeSensitiveDataQuery = [
  '-password',
  '-verificationToken',
  '-resetPasswordToken',
  '-resetPasswordTokenExpiryDate',
];

const removeSensitiveDataQueryKeepPassword = [
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

// /**
//  * Gets a user from the database by their id but doesn't include the
//  * password in the returned user.
//  * @param id The id of the user to get.
//  * @returns The {@link User} or null if the user was not found.
//  */
// const getUserById = async (id: string) => {
//   const user = await User.findById(id).select(removeSensitiveDataQuery).exec();
//   return user;
// };

/**
 * @returns All the {@link Schools}s in the database without their passwords.
 */
const getAllSchoolsFromDB = async () => {
  const schoolList = await School.find({})
    .select(removeSensitiveDataQuery)
    .exec();
  return schoolList;
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
  _id: string,
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
  const school = await School.findOneAndUpdate({ _id }, newSchool).exec();
  return school;
};

export {
  passwordHashSaltRounds,
  createSchoolInDB,
  getAllSchoolsFromDB,
  deleteSchoolById,
  updateSchoolById,
};
