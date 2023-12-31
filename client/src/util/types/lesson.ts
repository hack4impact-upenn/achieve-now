// eslint-disable-next-line
import mongoose from 'mongoose';

interface ILesson extends mongoose.Document {
  _id: string;
  number: number;
  title: string;
  parent_resources: [string];
  coach_resources: [string];
}

export default ILesson;
