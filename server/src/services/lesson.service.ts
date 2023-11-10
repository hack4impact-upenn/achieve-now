/**
 * All the functions for interacting with student data in the MongoDB database
 */
import { Lesson } from '../models/lesson.model';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const passwordHashSaltRounds = 10;
const removeSensitiveDataQuery = [
  '-password',
  '-verificationToken',
  '-resetPasswordToken',
  '-resetPasswordTokenExpiryDate',
];

/**
 * @returns All the {@link Lesson}s in the database without their passwords.
 */
const getAllLessonsFromDB = async () => {
  const userList = await Lesson.find({})
    .select(removeSensitiveDataQuery)
    .exec();
  return userList;
};

export { passwordHashSaltRounds, getAllLessonsFromDB };
