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
  teacher_id: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    required: true,
  },
  coach_id: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    required: true,
  },
  block_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Block',
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
    default: [],
  },
  coach_additional_resources: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
    required: true,
    default: [],
  },
  progress_stats: {
    type: Map,
    of: {
      type: Map,
      of: Number,
    },
    required: true,
    default: {},
  },
  parent_name: {
    type: String,
    required: true,
  },
  parent_commmunication_days: {
    type: String,
    enum: ['weekends', 'weekdays', 'any'],
    required: false,
  },
  parent_communication_times: {
    type: String,
    enum: ['morning', 'afternoon', 'evening'],
    required: false,
  },
  media_waiver: {
    type: Boolean,
    required: true,
    default: false,
  },
  work_habits: {
    type: String,
    required: false,
  },
});

interface IStudent extends mongoose.Document {
  _id: string;
  user_id: string;
  school_id: [string];
  teacher_id: [string];
  coach_id: [string];
  block_id: string;
  lesson_level: string;
  parent_additional_resources: [string];
  coach_additional_resources: [string];
  progress_stats: Map<string, Map<string, number>>;
  parent_name: string;
  parent_commmunication_days: string;
  parent_communication_times: string;
  media_waiver: boolean;
  work_habits: string;
}

const Student = mongoose.model<IStudent>('Student', StudentSchema);

export { IStudent, Student };
