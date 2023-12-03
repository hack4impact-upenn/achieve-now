import React from 'react';
import { Box, Typography } from '@mui/material';
// eslint-disable-next-line import/no-extraneous-dependencies
import mongoose from 'mongoose';
import { useData } from '../util/api';

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
  grade: string;
  family: string;
  favorite_food: string;
  likes: string;
  dislikes: string;
  what_motivates_them: string;
  what_reading_strategies_worked: string;
  what_reading_strategies_didnt_work: string;
  progressFlag: boolean;
  academicFlag: boolean;
  updates: string;
}

export default function Updates({ studentId }: { studentId: string }) {
  const studentResponse = useData(`student/student/${studentId}`);
  const student: IStudent | null = studentResponse?.data || null;

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        border: '1px solid black',
        borderRadius: '10px',
        padding: '16px',
      }}
    >
      <Typography variant="h5" fontWeight={700}>
        Updates
      </Typography>
      <Typography variant="subtitle1">{student?.updates}</Typography>
    </Box>
  );
}
