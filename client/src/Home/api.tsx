import { postData, putData } from '../util/api';
import IStudent from '../util/types/student';
import IUser from '../util/types/user';

interface ResolvedReq {
  data: any | null;
  error: Error | any | null;
}

/**
 * Makes a request to the server to logout a user from the current session
 * @returns true if successful, false otherwise
 */
async function logout() {
  const res = await postData('auth/logout');
  if (res.error) return false;
  return true;
}
/**
 * Makes a request to the server to upgrade a self to admin from the current session
 * @returns true if successful, false otherwise
 * PLEASE REMOVE THIS FUNCTION AND BACKEND ENDPOINT UPON DEPLOYMENT
 */
async function selfChange(email: string, role: string) {
  const res = await putData('admin/auto-change-role', { email, role });
  if (res.error) return false;
  return true;
}

async function addBlock(values: any) {
  const { day, name, startTime, endTime, zoom, pairs } = values;

  const students = new Set();
  const coachPromises: Promise<ResolvedReq>[] = [];

  pairs.forEach((pair: [IUser, IStudent]) => {
    students.add(pair[1].user_id);

    coachPromises.push(
      putData('student/add-coach', {
        student_id: pair[1]._id /* eslint no-underscore-dangle: 0 */,
        coach_id: pair[0]._id /* eslint no-underscore-dangle: 0 */,
      }),
    );
  });
  console.log(students);

  await Promise.all(coachPromises);

  const res = await putData('block/add-block', {
    day,
    name,
    startTime,
    endTime,
    zoom,
    students: Array.from(students),
  });
  if (res.error) {
    throw Error(res.error.message);
  }
  return res;
}

async function editBlock(values: any) {
  const { blockId, day, name, startTime, endTime, zoom, pairs } = values;

  const students = new Set();
  const coachPromises: Promise<ResolvedReq>[] = [];

  pairs.forEach((pair: [IUser, IStudent]) => {
    students.add(pair[1].user_id);

    coachPromises.push(
      putData('student/add-coach', {
        student_id: pair[1]._id /* eslint no-underscore-dangle: 0 */,
        coach_id: pair[0]._id /* eslint no-underscore-dangle: 0 */,
      }),
    );
  });

  await Promise.all(coachPromises);

  const res = await putData('block/edit-block', {
    blockId,
    day,
    name,
    startTime,
    endTime,
    zoom,
    students: Array.from(students),
  });
  if (res.error) {
    throw Error(res.error.message);
  }
}

// eslint-disable-next-line import/prefer-default-export
export { logout, selfChange, addBlock, editBlock };
