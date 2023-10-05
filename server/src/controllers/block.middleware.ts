/**
 * All the middleware functions related to blocks
 */
import express from 'express';
import ApiError from '../util/apiError';
import { getBlock } from '../services/block.service';

const isExist = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  // Get Block
  const { day, startTime, endTime, block } = req.body;
  // Check if the block exists
  const blockRes = await getBlock(day, startTime, endTime, block);
  // If it does, return an error
  if (blockRes) {
    next(ApiError.badRequest('Block already exists.'));
  } else {
    next();
  }
};

// eslint-disable-next-line import/prefer-default-export
export { isExist };
