/**
 * Specifies the middleware and controller functions to call for each route
 * relating to authentication.
 */
import express from 'express';
import getStudent from '../controllers/student.controller';
import 'dotenv/config';

const router = express.Router();

/**
 * TO DELETE
 * A GET route to get a student object
 * - id of the student
 */
router.get('/:id', getStudent);

export default router;
