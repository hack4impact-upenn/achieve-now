import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  school_id: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'School' }],
    required: false,
  },
  teacher_id: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    required: false,
  },
  coach_id: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    required: false,
  },
  block_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Block',
    required: false,
  },
  lesson_level: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: false,
  },
  parent_additional_resources: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
    required: false,
    default: [],
  },
  coach_additional_resources: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
    required: false,
    default: [],
  },
  progress_stats: {
    attendance: {
      type: Map,
      of: String,
      required: false,
      default: {},
    },
    student_next_steps: {
      type: Map,
      of: String,
      required: false,
      default: {},
    },
    student_observations: {
      type: Map,
      of: String,
      required: false,
      default: {},
    },
  },
  parent_name: {
    type: String,
    required: true,
  },
  parent_communication_days: {
    type: String,
    enum: ['weekends', 'weekdays', 'any'],
    required: true,
  },
  parent_communication_times: {
    type: String,
    enum: ['morning', 'afternoon', 'evening'],
    required: true,
  },
  best_communication_method: {
    type: String,
    enum: ['email', 'phone', 'text'],
    required: true,
  },
  personality: {
    type: String,
    required: true,
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
  grade: {
    type: Number,
    required: false,
  },
  admin_updates: {
    type: String,
    required: false,
  },
  family: {
    type: String,
    required: false,
  },
  fav_food: {
    type: String,
    required: false,
  },
  likes: {
    type: String,
    required: false,
  },
  dislikes: {
    type: String,
    required: false,
  },
  progressFlag: {
    type: Boolean,
    required: true,
    default: false,
  },
  attendanceFlag: {
    type: Boolean,
    required: true,
    default: false,
  },
  updates: {
    type: String,
    required: false,
  },
  levelsCompleted: {
    type: [Boolean],
    required: false,
  },
  motivation: {
    type: String,
    required: false,
  },
  good_strategies: {
    type: String,
    required: false,
  },
  bad_strategies: {
    type: String,
    required: false,
  },
  badges: {
    type: [String],
    required: false,
    default: [],
  },
  risingReadersScore: {
    type: [Number],
    required: false,
    default: [],
  },
  generalProgramScore: {
    type: [Number],
    required: false,
    default: [],
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
  parent_additional_resources: string[];
  coach_additional_resources: string[];
  progress_stats: {
    attendance: Map<number, string>;
    student_next_steps: Map<number, string>;
    student_observations: Map<number, string>;
  };
  parent_name: string;
  parent_communication_days: string;
  parent_communication_times: string;
  best_communication_method: string;
  personality: string;
  media_waiver: boolean;
  work_habits: string;
  grade: number;
  progressFlag: boolean;
  attendanceFlag: boolean;
  updates: string;
  levelsCompleted: [boolean];
  admin_updates: string;
  family: string;
  fav_food: string;
  likes: string;
  dislikes: string;
  motivation: string;
  good_strategies: string;
  bad_strategies: string;
  badges: [string];
  risingReadersScore: [number];
  generalProgramScore: [number];
}

const Student = mongoose.model<IStudent>('Student', StudentSchema);
export { IStudent, Student };
