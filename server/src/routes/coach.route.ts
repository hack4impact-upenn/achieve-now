import { Router } from "express";
import { isAuthenticated } from "../controllers/auth.middleware";
import { isAdmin } from "../controllers/admin.middleware";
import { createCoach, createCoachAttendanceByDate, deleteCoachAttendanceByDate, getAllCoaches, updateCoachAttendance } from "../controllers/coach.controller";

const coachRouter = Router();

coachRouter.get('/all', isAuthenticated, isAdmin, getAllCoaches);

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

export default coachRouter;
