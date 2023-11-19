/**
 * All the functions for interacting with school data in the MongoDB database
 */
import { School } from '../models/school.model';

/**
 * createSchool creates a school in the database
 * @returns the newly created school
 */
const createSchoolInDB = async (name: string, info: string) => {
  const newSchool = new School({
    name,
    info,
  });
  const school = await newSchool.save();
  return school;
};

/**
 * @returns All the {@link School}s in the database.
 */
const getAllSchoolsInDB = async () => {
  const schoolList = await School.find({});
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

export { createSchoolInDB, getAllSchoolsInDB, getSchoolByIdInDB };
