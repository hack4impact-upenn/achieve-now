/**
 * Specifies the middleware and controller functions to call for each route
 * relating to authentication.
 */
import express from 'express';
import {
  login,
  logout,
  register,
  approve,
  sendResetPasswordEmail,
  resetPassword,
  verifyAccount,
  registerInvite,
  onboardStudent,
} from '../controllers/auth.controller';
import { isAuthenticated } from '../controllers/auth.middleware';
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
router.post('/register', register);

/**
 * A POST route to verify a user's account. Expects a JSON body with the following fields:
 * - token (string) - The token identifying the verification attempt
 */
router.post('/verify-account', verifyAccount);

/**
 * A POST route to log in a user. Expects a JSON body with the following fields:
 * - email (string) - The email of the user
 * - password (string) - The password of the user
 */
router.post('/login', login);

/**
 * A POST route to log out a user.
 */
router.post('/logout', isAuthenticated, logout);

/**
 * A POST route to send a password reset email to a user. Expects a JSON body
 * with the following fields:
 * - email (string) - The email of the user
 */
router.post('/send-reset-password-email', sendResetPasswordEmail);

/**
 * A POST route to reset a user's password. Expects a JSON body with the
 * following fields:
 * - password (string) - The new password of the user
 * - token (string) - The token identifying the reset password attempt
 */
router.post('/reset-password', resetPassword);

/**
 * A GET request to check if a user is an logged in. Utilizes the middleware to
 * check if a user if authenticated. Returns 200 OK if the user is authenticated
 * and 401 unauthorized if the user is not authenticated.
 */
router.get('/authstatus', isAuthenticated, approve);

/**
 * A POST register a user from an invite. If the information and invite are valid
 * a new account is created. Otherwise a 400 bad request error is returned
 */
router.post('/register-invite', registerInvite);

/**
 * A POST route to onboard a student user. If the information is valid a new
 * student object is created. Otherwise a 400 bad request error is returned.
 */
router.post('/onboard-student', onboardStudent);

export default router;
