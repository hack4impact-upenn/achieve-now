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
  time: {
    type: String,
    required: true,
  },
  block: {
    type: Number,
    required: true,
  },
  zoom: {
    type: String,
    required: true,
  },
});

interface IBlock extends mongoose.Document {
  _id: string;
  day: string;
  time: string;
  block: number;
  zoom: string;
}

const Block = mongoose.model<IBlock>('Block', BlockSchema);

export { IBlock, Block };
