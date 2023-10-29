/**
 * Mongo functions for all block objects
 */

import { Block } from '../models/block.model';

const getBlockById = async (id: string) => {
  const response = await Block.findById(id);
  console.log(response);
  return response;
};

const getBlock = async (
  day: number,
  startTime: string,
  endTime: string,
  block: number,
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

/**
 * @returns All the {@link Block}s in the database
 */
const getAllBlocksfromDB = async () => {
  const blockList = await Block.find({}).exec();
  return blockList;
};

export {
  getBlockById,
  getBlock,
  getStudents,
  addBlock,
  editBlock,
  getAllBlocksfromDB,
};