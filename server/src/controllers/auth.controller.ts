/**
 * All the controller functions containing the logic for routes relating to a
 * user's authentication such as login, logout, and registration.
 */
import express from 'express';
import passport from 'passport';
import crypto from 'crypto';
import { hash } from 'bcrypt';
import { IUser } from '../models/user.model';
import StatusCode from '../util/statusCode';
import {
  passwordHashSaltRounds,
  createUser,
  getUserByEmail,
  getUserByResetPasswordToken,
  getUserByVerificationToken,
  updateUserInfo,
} from '../services/user.service';
import {
  emailResetPasswordLink,
  emailVerificationLink,
} from '../services/mail.service';
import ApiError from '../util/apiError';
import {
  getInviteByToken,
  removeInviteByToken,
} from '../services/invite.service';
import { IInvite } from '../models/invite.model';
import { createStudent } from '../services/student.service';
import { createCoachFromUser } from '../services/coach.service';

/**
 * A controller function to login a user and create a session with Passport.
 * On success, the user's information is returned.
 * Else, send an appropriate error message.
 */
const login = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  if (req.isAuthenticated()) {
    next(ApiError.badRequest('Already logged in'));
    return;
  }
  // TODO: look more into when each of these errors are thrown
  passport.authenticate(
    ['local'],
    {
      failureMessage: true,
    },
    // Callback function defined by passport strategy in configPassport.ts
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (err: any, user: any, info: any) => {
      if (err) {
        next(ApiError.internal('Failed to authenticate user.'));
        return;
      }
      if (!user) {
        next(ApiError.unauthorized('Incorrect credentials'));
        return;
      }
      if (!user!.verified) {
        next(ApiError.unauthorized('Need to verify account by email'));
        return;
      }
      req.logIn(user, (error) => {
        if (error) {
          next(ApiError.internal('Failed to log in user'));
          return;
        }
        res.status(StatusCode.OK).send(user);
      });
    },
  )(req, res, next);
};

/**
 * A controller function to logout a user with Passport and clear the session.
 */
const logout = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  // Logout with Passport which modifies the request object
  req.logout((err) => {
    if (err) {
      next(ApiError.internal('Failed to log out user'));
      return;
    }
    // Destroy the session
    if (req.session) {
      req.session.destroy((e) => {
        if (e) {
          next(ApiError.internal('Unable to logout properly'));
        } else {
          res.sendStatus(StatusCode.OK);
        }
      });
    }
  });
};

/**
 * A controller function to register a user in the database.
 * TODO: will be deleted in the future, but will error -- should we add role now?
 */
const register = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { firstName, lastName, email, password, role } = req.body;
  if (!firstName || !lastName || !email || !password) {
    next(
      ApiError.missingFields(['firstName', 'lastName', 'email', 'password']),
    );
    return;
  }
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/g;

  const passwordRegex = /^[a-zA-Z0-9!?$%^*)(+=._-]{6,61}$/;

  const nameRegex = /^[a-z ,.'-]+/i;

  if (
    !email.match(emailRegex) ||
    !password.match(passwordRegex) ||
    !firstName.match(nameRegex) ||
    !lastName.match(nameRegex)
  ) {
    next(ApiError.badRequest('Invalid email, password, or name.'));
    return;
  }

  if (req.isAuthenticated()) {
    next(ApiError.badRequest('Already logged in.'));
    return;
  }
  const lowercaseEmail = email.toLowerCase();
  // Check if user exists
  const existingUser: IUser | null = await getUserByEmail(lowercaseEmail);
  if (existingUser) {
    next(
      ApiError.badRequest(
        `An account with email ${lowercaseEmail} already exists.`,
      ),
    );
    return;
  }

  // Create user and send verification email
  try {
    const user = await createUser(
      firstName,
      lastName,
      lowercaseEmail,
      password,
      role,
    );
    // Don't need verification email if testing
    if (process.env.NODE_ENV === 'test') {
      user!.verified = true;
      await user?.save();
    } else {
      const verificationToken = crypto.randomBytes(32).toString('hex');
      user!.verificationToken = verificationToken;
      await user!.save();
      await emailVerificationLink(lowercaseEmail, verificationToken);
    }
    res.sendStatus(StatusCode.CREATED);
  } catch (err) {
    next(ApiError.internal('Unable to register user.'));
  }
};

/**
 * A dummy controller function which sends a 200 OK status code. Should be used to close a request after a middleware call.
 */
const approve = async (req: express.Request, res: express.Response) => {
  res.sendStatus(StatusCode.OK);
};

/**
 * A controller function to verify an account with a verification token.
 */
const verifyAccount = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { token } = req.body;
  if (!token) {
    next(ApiError.missingFields(['token']));
    return;
  }

  const user = await getUserByVerificationToken(token);
  if (!user) {
    next(ApiError.badRequest('Invalid verification token.'));
    return;
  }
  user!.verificationToken = undefined;
  user!.verified = true;
  try {
    await user!.save();
    res.sendStatus(StatusCode.OK);
  } catch (err) {
    next(ApiError.internal('Unable to verify the account.'));
  }
};

/**
 * A controller function to send a password reset link to a user's email.
 */
const sendResetPasswordEmail = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { email } = req.body;
  if (!email) {
    next(ApiError.missingFields(['email']));
    return;
  }
  const lowercaseEmail = email.toLowerCase();

  const user: IUser | null = await getUserByEmail(lowercaseEmail);
  if (!user) {
    next(
      ApiError.notFound(`No user with email ${lowercaseEmail} is registered.`),
    );
    return;
  }

  // Generate a token for the user for this reset link
  const token = crypto.randomBytes(32).toString('hex');
  user!.resetPasswordToken = token;
  user!.resetPasswordTokenExpiryDate = new Date(
    new Date().getTime() + 60 * 60 * 1000,
  ); // Expires in an hour
  await user!.save();

  // Send the email and return an appropriate response
  emailResetPasswordLink(lowercaseEmail, token)
    .then(() =>
      res.status(StatusCode.CREATED).send({
        message: `Reset link has been sent to ${lowercaseEmail}`,
      }),
    )
    .catch(() => {
      next(ApiError.internal('Failed to email reset password link.'));
    });
};

/**
 * A controller function to reset a user's password.
 */
const resetPassword = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { password, token } = req.body;
  if (!password || !token) {
    next(ApiError.missingFields(['password', 'token']));
    return;
  }

  const user: IUser | null = await getUserByResetPasswordToken(token);
  if (!user) {
    next(ApiError.badRequest('Invalid reset password token.'));
    return;
  }

  if (Date.now() > user.resetPasswordTokenExpiryDate!.getTime()) {
    next(ApiError.forbidden('Reset password token has expired.'));
    return;
  }
  // Hash the password before storing
  let hashedPassword: string | undefined;
  try {
    hashedPassword = await hash(password, passwordHashSaltRounds);
  } catch (err) {
    next(ApiError.internal('Unable to reset the password'));
    return;
  }

  // Set new password for user
  user!.password = hashedPassword;
  user!.resetPasswordToken = undefined;
  user!.resetPasswordTokenExpiryDate = undefined;
  try {
    await user.save();
    res.sendStatus(StatusCode.OK);
  } catch (err) {
    next(ApiError.internal('Unable to reset the password'));
  }
};

const registerInvite = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { firstName, lastName, email, password, inviteToken } = req.body;
  if (!firstName || !lastName || !email || !password) {
    next(
      ApiError.missingFields([
        'firstName',
        'lastName',
        'email',
        'password',
        'inviteToken',
      ]),
    );
    return;
  }
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/g;

  const passwordRegex = /^[a-zA-Z0-9!?$%^*)(+=._-]{6,61}$/;

  const nameRegex = /^[a-z ,.'-]+/i;

  if (
    !email.match(emailRegex) ||
    !password.match(passwordRegex) ||
    !firstName.match(nameRegex) ||
    !lastName.match(nameRegex)
  ) {
    next(ApiError.badRequest('Invalid email, password, or name.'));
    return;
  }

  if (req.isAuthenticated()) {
    next(ApiError.badRequest('Already logged in.'));
    return;
  }

  // Check if invite exists
  const invite: IInvite | null = await getInviteByToken(inviteToken);
  if (!invite || invite.email !== email) {
    next(ApiError.badRequest(`Invalid invite`));
    return;
  }

  const lowercaseEmail = email.toLowerCase();
  // Check if user exists
  const existingUser: IUser | null = await getUserByEmail(lowercaseEmail);
  if (existingUser) {
    next(
      ApiError.badRequest(
        `An account with email ${lowercaseEmail} already exists.`,
      ),
    );
    return;
  }

  // Create user
  try {
    const user = await createUser(
      firstName,
      lastName,
      lowercaseEmail,
      password,
      invite.role,
    );
    if (!user) {
      next(ApiError.internal('Unable to register user.'));
      return;
    }
    if (invite.role === 'coach') {
      await createCoachFromUser(user._id);
    }
    user.verified = true;
    await user?.save();
    await removeInviteByToken(inviteToken);
    res.send(user);
    return;
  } catch (err) {
    next(ApiError.internal('Unable to register user.'));
  }
};

const onboardStudent = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const {
    email,
    studentFirst,
    studentLast,
    parentName,
    parentPhone,
    parentCommunicationDays,
    parentCommunicationTimes,
    bestCommunicationMethod,
    personality,
  } = req.body;
  if (
    !email ||
    !studentFirst ||
    !studentLast ||
    !parentName ||
    !parentPhone ||
    !parentCommunicationDays ||
    !parentCommunicationTimes ||
    !bestCommunicationMethod ||
    !personality
  ) {
    next(
      ApiError.missingFields([
        'email',
        'studentFirst',
        'studentLast',
        'parentName',
        'parentPhone',
        'parentCommunicationDays',
        'parentCommunicationTimes',
        'bestCommunicationMethod',
        'personality',
      ]),
    );
    return;
  }
  const nameRegex = /^[a-z ,.'-]+/i;
  if (!parentName.match(nameRegex)) {
    next(ApiError.badRequest('Invalid parent name.'));
    return;
  }
  if (!studentFirst.match(nameRegex)) {
    next(ApiError.badRequest('Invalid student first name.'));
    return;
  }
  if (!studentLast.match(nameRegex)) {
    next(ApiError.badRequest('Invalid student last name.'));
    return;
  }
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  if (!parentPhone.match(phoneRegex)) {
    next(ApiError.badRequest('Invalid phone number.'));
    return;
  }
  const communicationDaysRegex = /^(weekends|weekdays|any)$/;
  if (!parentCommunicationDays.match(communicationDaysRegex)) {
    next(ApiError.badRequest('Invalid parent communication days.'));
    return;
  }
  const communicationTimesRegex = /^(morning|afternoon|evening)$/;
  if (!parentCommunicationTimes.match(communicationTimesRegex)) {
    next(ApiError.badRequest('Invalid parent communication times.'));
    return;
  }
  const communicationMethodRegex = /^(email|phone|text)$/;
  if (!bestCommunicationMethod.match(communicationMethodRegex)) {
    next(ApiError.badRequest('Invalid best communication method.'));
  }
  try {
    const userId = await getUserByEmail(email);
    if (!userId) {
      next(ApiError.badRequest('Invalid email.'));
      return;
    }
    console.log(userId);
    if (userId.role !== 'parent') {
      next(ApiError.badRequest('Invalid role.'));
      return;
    }
    const userObj = await updateUserInfo(
      userId._id,
      studentFirst,
      studentLast,
      userId.email,
      parentPhone,
    );
    if (!userObj) {
      next(ApiError.badRequest('Invalid user.'));
      return;
    }
    const studentObj = await createStudent(
      userId._id,
      parentName,
      parentCommunicationTimes,
      parentCommunicationDays,
      bestCommunicationMethod,
      personality,
    );
    if (!studentObj) {
      next(ApiError.badRequest('Invalid student.'));
      return;
    }
    res.sendStatus(StatusCode.CREATED);
  } catch {
    next(ApiError.internal('Unable to onboard student.'));
  }
};

const getRole = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  if (!req.isAuthenticated()) {
    next(ApiError.unauthorized('Not logged in.'));
    return;
  }
  const user: IUser | null = req.user as IUser;
  // Check is user exists and is valid
  if (!user) {
    next(ApiError.unauthorized('Not a valid user.')); // TODO: see if this is the correct message
    return;
  }
  res.send(user.role);
};

export {
  login,
  logout,
  register,
  approve,
  verifyAccount,
  sendResetPasswordEmail,
  resetPassword,
  registerInvite,
  onboardStudent,
  getRole,
};
