/**
 * Mongo functions for all block objects
 */

import { Block, IBlock } from '../models/block.model';

const getBlock = async (
  startTime: string,
  endTime: string,
  block: number,
  day: number,
) => {
  const response = await Block.findOne({
    startTime,
    endTime,
    block,
    day,
  });
  return response;
};

const getStudents = async (id: string) => {
  const response = await Block.findById(id).populate('students');
  return response;
};

const addBlock = async (
  day: string,
  startTime: string,
  endTime: string,
  block: number,
  zoom: string,
  students: string[],
) => {
  const response = await Block.create({
    day,
    startTime,
    endTime,
    block,
    zoom,
    students,
  });
  return response;
};

const editBlock = async (
  day: string,
  startTime: string,
  endTime: string,
  block: number,
  zoom: string,
  students: string[],
) => {
  const response = await Block.findOneAndUpdate(
    { day, startTime, endTime, block, zoom },
    { students },
  );
  return response;
};

export { getBlock, getStudents, addBlock, editBlock };
