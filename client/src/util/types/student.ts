/**
 * Interface for the student data type return from the backend
 */
interface IStudent {
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
  progressFlag: boolean;
  academicFlag: boolean;
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

export default IStudent;
