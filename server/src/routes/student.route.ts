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
 * A POST route to register a user. Expects a JSON body with the following fields:
 * - firstName (string) - The first name of the user
 * - lastName (string) - The last name of the user
 * - email (string) - The email of the user
 * - password (string) - The password of the user
 */
router.post('/:id', getStudent);

export default router;
