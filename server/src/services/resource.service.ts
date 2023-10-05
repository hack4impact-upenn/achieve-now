/**
 * All the functions for interacting with student data in the MongoDB database
 */
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
 * @returns All the {@link Resource}s in the database without their passwords.
 */
const getAllResourcesFromDB = async () => {
  const userList = await Resource.find({})
    .select(removeSensitiveDataQuery)
    .exec();
  return userList;
};

export { passwordHashSaltRounds, getAllResourcesFromDB };
