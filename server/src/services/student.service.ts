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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const removeSensitiveDataQueryKeepPassword = [
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
 * @returns The {@link Student} or null if the user was not found.
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

export {
  passwordHashSaltRounds,
  getStudentByID,
  getResourceByID,
  updateResourcesByID,
  getAllStudentsFromDB,
};
