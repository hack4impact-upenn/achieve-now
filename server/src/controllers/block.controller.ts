import express from 'express';
import ApiError from '../util/apiError';
import StatusCode from '../util/statusCode';
import { IBlock } from '../models/block.model';
import {
  getBlock,
  getStudents,
  addBlock,
  editBlock,
} from '../services/block.service';

const getBlockInfo = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  return getBlock(
    req.body.day,
    req.body.startTime,
    req.body.endTime,
    req.body.block,
  ).then((block: IBlock | null) => {
    if (!block) {
      next(ApiError.notFound('Block not found'));
    } else {
      getStudents(block._id).then((students) => {
        res.status(StatusCode.OK).send(students);
      });
    }
  });
};

const putAddBlock = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  return (
    addBlock(
      req.body.day,
      req.body.startTime,
      req.body.endTime,
      req.body.block,
      req.body.zoom,
      req.body.students,
    )
      .then((block) => {
        res.status(StatusCode.OK).send(block);
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch((e) => {
        next(ApiError.internal('Unable to add block'));
      })
  );
};

const putEditBlock = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  return (
    editBlock(
      req.body.day,
      req.body.startTime,
      req.body.endTime,
      req.body.block,
      req.body.zoom,
      req.body.students,
    )
      .then((block) => {
        res.status(StatusCode.OK).send(block);
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch((e) => {
        next(ApiError.internal('Unable to edit block'));
      })
  );
};

export { getBlockInfo, putAddBlock, putEditBlock };
