import { Block } from '../models/block.model';

/**
 * @returns All the {@link Block}s in the database
 */
const getAllBlocksfromDB = async () => {
  const blockList = await Block.find({}).exec();
  return blockList;
};

export { getAllBlocksfromDB };
