/**
 * All the middleware functions related to blocks
 */
import express from 'express';
import ApiError from '../util/apiError';

const isExist = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  // Get Block
  const { day, time, block } = req.body;
  // Check if the block exists
};
