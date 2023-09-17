import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  school_id: {
    type: [String],
    required: true,
  },
  coach_id: {
    type: [String],
    required: true,
  },
  lesson_level: {
    type: String,
    required: true,
  },
  parent_additional_resources: {
    type: [String],
    required: true,
  },
  coach_additional_resources: {
    type: [String],
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
