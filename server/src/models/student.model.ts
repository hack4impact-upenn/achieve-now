import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  school_id: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'School' }],
    required: true,
  },
  coach_id: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    required: true,
  },
  lesson_level: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true,
  },
  parent_additional_resources: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
    required: true,
  },
  coach_additional_resources: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
    required: true,
  },
  progress_stats: {
    type: Map,
    of: {
      type: Map,
      of: Number,
    },
    required: true,
  },
});

interface IStudent extends mongoose.Document {
  _id: string;
  user_id: string;
  school_id: [string];
  coach_id: [string];
  lesson_level: string;
  parent_additional_resources: [string];
  coach_additional_resources: [string];
  progress_stats: Map<string, Map<string, number>>;
}

const Student = mongoose.model<IStudent>('Student', StudentSchema);

export { IStudent, Student };
