import express from 'express';
import ApiError from '../util/apiError';
import StatusCode from '../util/statusCode';
import { IBlock } from '../models/block.model';
import {
  getBlock,
  getStudents,
  addBlock,
  editBlock,
  getBlockById,
  getBlockByStudentId,
  getAllBlocksfromDB,
} from '../services/block.service';

const getBlockInfoById = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  if (!req.params.id) {
    next(ApiError.missingFields(['id']));
  }
  const block = await getBlockById(req.params.id);
  res.status(StatusCode.OK).send(block);
};

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
      req.body.name,
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
        console.log(e);
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
      req.body.blockId,
      req.body.day,
      req.body.name,
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

const getBlockInfoByStudentId = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { id } = req.params;
  if (!id) {
    next(ApiError.missingFields(['id']));
    return;
  }
  const block = await getBlockByStudentId(id);
  res.status(StatusCode.OK).send(block);
};

const getBlocks = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const blocks = await getAllBlocksfromDB();
  res.status(StatusCode.OK).send(blocks);
};

export {
  getBlockInfoById,
  getBlockInfo,
  putAddBlock,
  putEditBlock,
  getBlockInfoByStudentId,
  getBlocks,
};
