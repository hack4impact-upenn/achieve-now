/**
 * A file containing all the api calls for the student profile.
 */
import { getData } from '../util/api';

/**
 * Sends a request to the server to delete a user
 * @param email - the email of the user to delete
 * @returns true if successful, false otherwise
 */
async function getStudentInfo(studentId: string) {
  // TODO: need to create a new route to get data
  const res = await getData(``);
  if (res.error) return false;
  return true;
}

export default { getStudentInfo };
