/**
 * Interface for the Block data type return from the backend
 */
interface IBlock {
  _id: string;
  day: string;
  startTime: string;
  endTime: string;
  name: string;
  block: number;
  zoom: string;
  students: [string];
}

export default IBlock;
