/**
 * All the middleware functions related to blocks
 */
import express from 'express';
import ApiError from '../util/apiError';
import { Block, IBlock } from '../models/block.model';
import { getBlock } from '../services/block.service';

const isExist = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  // Get Block
  const { day, time, block } = req.body;
  // Check if the block exists
  getBlock(day, time, block);
    // If it does, return an error
    res.
    // If it doesn't, call next()
};
