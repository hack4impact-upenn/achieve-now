import { Student } from '../models/student.model';

const removeSensitiveDataQuery = [
  '-password',
  '-verificationToken',
  '-resetPasswordToken',
  '-resetPasswordTokenExpiryDate',
];

/**
 * Gets a user from the database by their email but doesn't include the
 * password in the returned user.
 * @param email The email of the user to get
 * @returns The {@link User} or null if the user was not found.
 */
const getStudentById = async (id: string) => {
  const user = await Student.findOne({ id })
    .select(removeSensitiveDataQuery)
    .exec();
  return user;
};

export default getStudentById;
