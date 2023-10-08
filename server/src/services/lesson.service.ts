/**
 * All the functions for interacting with lesson data in the MongoDB database
 */
import { Lesson } from '../models/lesson.model';
import { Resource } from '../models/resource.model';

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
 * @returns All the {@link Lesson}s in the database without their passwords.
 */
const getAllLessonsFromDB = async () => {
  const list = await Lesson.find({})
    .select(removeSensitiveDataQuery)
    .exec();
  return list;
};

/**
 * Gets a lesson from the database by their id.
 * @param id The id of the user to get.
 * @returns The {@link Lesson} or null if the user was not found.
 */
const getLessonByID = async (id: string) => {
  const user = await Lesson.findOne({ id })
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
 * A function that updates a lesson's resources
 * @param id The id of the user to delete.
 * @returns The updated {@link Lesson}
 */
const updateResourcesByID = async (id: string, resources: string[]) => {
  const lesson = await Lesson.findOneAndUpdate({ id }, [
    { $set: { parent_resources: resources } },
  ]).exec();
  return lesson;
};

export {
  passwordHashSaltRounds,
  getAllLessonsFromDB,
  getLessonByID,
  getResourceByID,
  updateResourcesByID,
};