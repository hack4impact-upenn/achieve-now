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

const coachRouter = Router();

coachRouter.get('/all', getAllCoaches);

coachRouter.post('/', isAuthenticated, isAdmin, createCoach);

coachRouter.put('/attendance', isAuthenticated, isAdmin, updateCoachAttendance);

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

coachRouter.get('/blocks/:id', isAuthenticated, isAdmin, getCoachBlocksById);

coachRouter.get('/student/:id', isAuthenticated, getStudentFromCoachById);

coachRouter.get('/:id', isAuthenticated, getCoachById);
coachRouter.get('/user/:id', isAuthenticated, getCoachByUserId);

coachRouter.put('/:id', putCoach);
coachRouter.put('/progress/:id', updateProgress);
coachRouter.delete('/progress/:id/:date', deleteProgress);
coachRouter.get('/resources/:id', isAuthenticated, getAllCoachResources);

export default coachRouter;
