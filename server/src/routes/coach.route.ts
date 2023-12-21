import { Router } from 'express';
import { isAuthenticated } from '../controllers/auth.middleware';
import { isAdmin } from '../controllers/admin.middleware';
import {
  createCoach,
  createCoachAttendanceByDate,
  deleteCoachAttendanceByDate,
  getAllCoaches,
  getCoachBlocksById,
  updateCoachAttendance,
  getStudentFromCoachById,
  getCoachById,
  putCoach,
  updateProgress,
  deleteProgress,
  getCoachByUserId,
  getAllCoachResources,
} from '../controllers/coach.controller';
import { approve } from '../controllers/auth.controller';
import { isCoach } from '../controllers/coach.middleware';

const coachRouter = Router();

coachRouter.post('/', isAuthenticated, isAdmin, createCoach);

coachRouter.get('/all', isAuthenticated, isAdmin, getAllCoaches);

/**
 * A GET route to check if the requestor is a coach. Checks first if the
 * requestor is a authenticated. Throws an error if the requestor is not an coach.
 */
coachRouter.get('/coachstatus', isAuthenticated, isCoach, approve);

coachRouter.put(
  '/attendance/create',
  isAuthenticated,
  isAdmin,
  createCoachAttendanceByDate,
);

coachRouter.put(
  '/attendance/delete',
  isAuthenticated,
  isAdmin,
  deleteCoachAttendanceByDate,
);

coachRouter.put('/attendance', isAuthenticated, isAdmin, updateCoachAttendance);

coachRouter.get('/blocks/:id', isAuthenticated, isAdmin, getCoachBlocksById);

coachRouter.get(
  '/student/:id',
  isAuthenticated,
  isCoach,
  getStudentFromCoachById,
);

coachRouter.delete(
  '/progress/:id/:date',
  isAuthenticated,
  deleteProgress,
);
coachRouter.put('/progress/:id', isAuthenticated, updateProgress);
coachRouter.get('/resources/:id', isAuthenticated, getAllCoachResources);

coachRouter.get('/user/:id', isAuthenticated, getCoachByUserId);
coachRouter.get('/:id', isAuthenticated, getCoachById);

coachRouter.put('/:id', isAuthenticated, putCoach);

export default coachRouter;
