import mongoose from 'mongoose';

const LessonSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  parent_resources: {
    type: [String],
    required: true,
  },
  coach_resources: {
    type: [String],
    required: true,
  },
});

interface ILesson extends mongoose.Document {
  _id: string;
  number: number;
  parent_resources: [string];
  coach_resources: [string];
}

const Lesson = mongoose.model<ILesson>('Lesson', LessonSchema);

export { ILesson, Lesson };
