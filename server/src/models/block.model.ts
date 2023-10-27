import mongoose from 'mongoose';

const BlockSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  block: {
    type: Number,
    required: false,
  },
  zoom: {
    type: String,
    required: true,
  },
  students: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    required: true,
    default: [],
  },
});

interface IBlock extends mongoose.Document {
  _id: string;
  day: string;
  name: string;
  startTime: string;
  endTime: string;
  block: number;
  zoom: string;
  students: [string];
}

const Block = mongoose.model<IBlock>('Block', BlockSchema);

export { IBlock, Block };
