/**
 * Interface for the user data type return from the backend
 */
interface IStudent {
  _id: string;
  user_id: string;
  name: string;
  school_id: [string];
  school_name: string;
  teacher_id: [string];
  teacher_name: string;
  coach_id: [string];
  block_id: string;
  phoneNumber: string;
  email: string;
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

export default IStudent;
