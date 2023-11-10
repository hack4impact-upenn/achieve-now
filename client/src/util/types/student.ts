// eslint-disable-next-line
import mongoose from 'mongoose';

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
  parent_communication_days: string;
  parent_communication_times: string;
  best_communication_method: string;
  personality: string;
  media_waiver: boolean;
  work_habits: string;
  grade: string;
  family: string;
  favorite_food: string;
  likes: string;
  dislikes: string;
  what_motivates_them: string;
  what_reading_strategies_worked: string;
  what_reading_strategies_didnt_work: string;
}

export default IStudent;
