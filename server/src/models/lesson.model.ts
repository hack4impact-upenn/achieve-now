import mongoose from 'mongoose';

const LessonSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  parent_resources: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
    required: false,
  },
  coach_resources: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
    required: false,
  },
});

interface ILesson extends mongoose.Document {
  _id: string;
  number: number;
  title: string;
  parent_resources: string[];
  coach_resources: string[];
}

const Lesson = mongoose.model<ILesson>('Lesson', LessonSchema);

export { ILesson, Lesson };
