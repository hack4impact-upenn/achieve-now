import { School } from '../models/school.model';

/**
 * Gets a user from the database by their id but doesn't include the
 * password in the returned user.
 * @param id The id of the user to get.
 * @returns The {@link User} or null if the user was not found.
 */
const getSchoolById = async (id: string) => {
  const school = await School.findById(id).exec();
  return school;
};

const getAllSchoolsfromDB = async () => {
  const schoolList = await School.find({}).exec();
  return schoolList;
};

export { getSchoolById, getAllSchoolsfromDB };
