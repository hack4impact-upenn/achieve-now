/**
 * All the functions for interacting with user data in the MongoDB database
 */
import { Student } from '../models/student.model';

/**
 * @returns All the {@link Student}s in the database.
 */
const getAllStudentsFromDB = async () => {
  const studentList = await Student.find({}).exec();
  return studentList;
};

export { getAllStudentsFromDB };
