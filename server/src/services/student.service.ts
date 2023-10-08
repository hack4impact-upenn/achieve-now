/**
 * All the functions for interacting with user data in the MongoDB database
 */
import { Student } from '../models/student.model';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const passwordHashSaltRounds = 10;
const removeSensitiveDataQuery = [
  '-password',
  '-verificationToken',
  '-resetPasswordToken',
  '-resetPasswordTokenExpiryDate',
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const removeSensitiveDataQueryKeepPassword = [
  '-verificationToken',
  '-resetPasswordToken',
  '-resetPasswordTokenExpiryDate',
];

/**
 * @returns All the {@link Student}s in the database.
 */
const getAllStudentsFromDB = async () => {
  const studentList = await Student.find({}).exec();
  return studentList;
};

/**
 * Gets a student from the database by their id.
 * @param id The id of the user to get.
 * @returns The {@link Student} or null if the user was not found.
 */
const getStudentByID = async (id: string) => {
  //   const user = await Student.findById(id).select(removeSensitiveDataQuery).exec();
  //   return user;
  const user = await Student.findOne({ id })
    .select(removeSensitiveDataQuery)
    .exec();
  return user;
};

export { getAllStudentsFromDB, getStudentByID };
