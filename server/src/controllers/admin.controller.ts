/**
 * All the controller functions containing the logic for routes relating to
 * admin users such as getting all users, deleting users and upgrading users.
 */
import express from 'express';
import crypto from 'crypto';
import ApiError from '../util/apiError';
import StatusCode from '../util/statusCode';
import { IUser } from '../models/user.model';
import {
  changeUserRole,
  getUserByEmail,
  getAllUsersFromDB,
  deleteUserById,
} from '../services/user.service';
import { getAllBlocksfromDB } from '../services/block.service';
import {
  createInvite,
  getInviteByEmail,
  getInviteByToken,
  updateInvite,
} from '../services/invite.service';
import { IInvite } from '../models/invite.model';
import { emailInviteLink } from '../services/mail.service';
import { batchReturnList, batchReturnVoid, batchReturnMultiList } from '../services/batch.service';
import { IBlock } from '../models/block.model';

/**
 * Get all users from the database. Upon success, send the a list of all users in the res body with 200 OK status code.
 */
const getAllUsers = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  return (
    getAllUsersFromDB()
      .then((userList) => {
        res.status(StatusCode.OK).send(userList);
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch((e) => {
        next(ApiError.internal('Unable to retrieve all users'));
      })
  );
};

/**
 * Upgrade a user to an admin. The email of the user is expected to be in the request body.
 * Upon success, return 200 OK status code.
 */
const changeRole = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { email, role } = req.body;
  if (!email) {
    next(ApiError.missingFields(['email']));
    return;
  }

  const user: IUser | null = await getUserByEmail(email);
  if (!user) {
    next(ApiError.notFound(`User with email ${email} does not exist`));
    return;
  }
  if (user.role === role) {
    next(ApiError.badRequest(`User is already: ${role}`));
    return;
  }

  changeUserRole(user._id, role)
    .then(() => {
      res.sendStatus(StatusCode.OK);
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .catch((e) => {
      next(ApiError.internal('Unable to upgrade user to admin.'));
    });
};

/**
 * Delete a user from the database. The email of the user is expected to be in the request parameter (url). Send a 200 OK status code on success.
 */
const deleteUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { email } = req.params;
  if (!email) {
    next(ApiError.missingFields(['email']));
    return;
  }

  // Check if user to delete is an admin
  const user: IUser | null = await getUserByEmail(email);
  if (!user) {
    next(ApiError.notFound(`User with email ${email} does not exist`));
    return;
  }

  const reqUser: IUser | undefined = req.user as IUser;
  if (reqUser.email === user.email) {
    next(ApiError.badRequest('Cannot delete self.'));
    return;
  }
  if (user.role === 'admin') {
    next(ApiError.forbidden('Cannot delete an admin.'));
    return;
  }

  deleteUserById(user._id)
    .then(() => res.sendStatus(StatusCode.OK))
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .catch((e) => {
      next(ApiError.internal('Failed to delete user.'));
    });
};

const verifyToken = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { token } = req.params;
  getInviteByToken(token)
    .then((invite) => {
      if (invite) {
        res.status(StatusCode.OK).send(invite);
      } else {
        next(ApiError.notFound('Unable to retrieve invite'));
      }
    })
    .catch(() => {
      next(ApiError.internal('Error retrieving invite'));
    });
};

const inviteUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { email, role } = req.body;
  let emailList = email.replaceAll(" ", "").split(",");
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/g;
  
  function validateEmail(email: string) {
    if (!email.match(emailRegex)) {
      next(ApiError.badRequest('Invalid email'));
    }
    return;
  }

  function validateNewUser(user: IUser) {
    if (user) {
      next(ApiError.badRequest(`An account with email ${user.email} already exists.`));
    }
    return;
  }

  function combineEmailToken(email: string, invite : IInvite | null) {
    const verificationToken = crypto.randomBytes(32).toString('hex');
    return [email, invite, verificationToken];
  }

  function sendInvite(combinedList: any[]) {
    try {
      // if (existingInvite) {
      //   await updateInvite(existingInvite, verificationToken);
      // } else {
      //   await createInvite(lowercaseEmail, verificationToken, role);
      // }

      //how to invite by role???
      const email = combinedList[0];
      const existingInvite = combinedList[1];
      const verificationToken = combinedList[2];

      emailInviteLink(email, verificationToken);
      return;
    } catch (err) {
      next(ApiError.internal('Unable to invite user.'));
    }
  }

  try {
    await batchReturnVoid(validateEmail, 10, emailList);
    const lowercaseEmailList: string[] | null = await batchReturnList(async (email: string) => {
      return email.toLowerCase();
    }, 10, emailList);

    const existingUserList: any[] | null = await batchReturnList(getUserByEmail, 10, lowercaseEmailList);
    await batchReturnVoid(validateNewUser, 10, existingUserList);

    const existingInviteList: any[] | null = await batchReturnList(getInviteByEmail, 10, existingUserList);
    const emailInviteList: any[] = await batchReturnMultiList(combineEmailToken, 10, lowercaseEmailList, existingInviteList)
    await batchReturnVoid(sendInvite, 10, emailInviteList);

    res.sendStatus(StatusCode.CREATED);
  } catch (err) {
    next(ApiError.internal('Unable to invite user.'));
    //how to send the message in frontend???
  }
};

/**
 * Get all blocks from the database. Upon success, send the a list of all blocks in the res body with 200 OK status code.
 */
const getAllBlocks = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  return (
    getAllBlocksfromDB()
      .then((blockList) => {
        const days = [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ];
        const sortedList = blockList.sort((block1, block2) => {
          if (days.indexOf(block1.day) !== days.indexOf(block2.day)) {
            return days.indexOf(block1.day) - days.indexOf(block2.day);
          }
          if (block1.startTime < block2.startTime) {
            return -1;
          }
          if (block1.startTime > block2.startTime) {
            return 1;
          }
          return 0;
        });
        const resp: { [key: string]: any } = {};
        days.forEach((day) => {
          const d: { [key: string]: any } = {};
          sortedList
            .filter((block) => {
              return block.day == day;
            })
            .forEach((block) => {
              const key = block.startTime.concat(block.endTime);
              if (!(key in d)) {
                d[key] = [];
              }
              d[key].push(block);
            });
          if (Object.keys(d).length) {
            resp[day] = d;
          }
        });
        res.status(StatusCode.OK).send(resp);
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch((e) => {
        next(ApiError.internal('Unable to retrieve all blocks'));
      })
  );
};

export {
  getAllUsers,
  changeRole,
  deleteUser,
  verifyToken,
  inviteUser,
  getAllBlocks,
};
