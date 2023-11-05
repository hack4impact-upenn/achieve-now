import { isAuthenticated } from '../controllers/auth.middleware';
import getAllSchools from '../controllers/school.controller';
import router from './admin.route';

/**
 * A GET route to get all schools.
 */
router.get('/all', isAuthenticated, getAllSchools);

export default router;
