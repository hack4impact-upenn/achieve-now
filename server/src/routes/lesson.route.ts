import { isAuthenticated } from '../controllers/auth.middleware';
import getAllLessons from '../controllers/lesson.controller';
import router from './admin.route';

/**
 * A GET route to get all lessons.
 */
router.get('/all', isAuthenticated, getAllLessons);

export default router;
