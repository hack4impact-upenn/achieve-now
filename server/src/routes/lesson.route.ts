import express from 'express';
import { isAuthenticated } from '../controllers/auth.middleware';
import getAllLessons from '../controllers/lesson.controller';

const lessonRouter = express.Router();
/**
 * A GET route to get all lessons.
 */
lessonRouter.get('/all', isAuthenticated, getAllLessons);

export default lessonRouter;
