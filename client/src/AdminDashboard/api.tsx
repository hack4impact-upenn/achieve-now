/**
 * A file containing all the api calls for the admin dashboard.
 */
import { deleteData, putData } from '../util/api';

/**
 * Sends a request to the server to delete a user
 * @param email - the email of the user to delete
 * @returns true if successful, false otherwise
 */
async function deleteUser(email: string) {
  const res = await deleteData(`admin/${email}`);
  if (res.error) return false;
  return true;
}
/**
 * Sends a request to the server to promote a user to admin
 * @param email - the email of the user to promote
 * @param role - the role of the user to promote
 * @returns true if successful, false otherwise
 */
async function changeOtherRole(email: string, role: string) {
  const res = await putData('admin/change-role', { email, role });
  if (res.error) return false;
  return true;
}

export { deleteUser, changeOtherRole };
