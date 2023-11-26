import React, { useEffect, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import Box from '@mui/material/Box';
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
}

interface ProgressData {
  date: string;
  observations: string | undefined;
  next_steps: string | undefined;
}

export default function ProgressSnapshot({ studentId }: { studentId: string }) {
  const [progressData, setProgressData] = useState<ProgressData[]>([]);

  const studentResponse = useData(`student/student/${studentId}`);
  const student: IStudent | null = studentResponse?.data || null;

  useEffect(() => {
    if (student && student.progress_stats) {
      // Convert the serialized map back to a Map object
      const observationsMap = new Map(
        Object.entries(student.progress_stats.student_observations).map(
          ([key, value]) => [Number(key), value],
        ),
      );
      const nextStepsMap = new Map(
        Object.entries(student.progress_stats.student_next_steps).map(
          ([key, value]) => [Number(key), value],
        ),
      );

      const combinedData: ProgressData[] = [];
      observationsMap.forEach((observation, dateKey) => {
        const nextStep = nextStepsMap.get(dateKey) || 'No next steps available';
        combinedData.push({
          date: new Date(dateKey).toLocaleDateString(),
          observations: observation,
          next_steps: nextStep,
        });
      });

      setProgressData(combinedData);
    }
  }, [student]);

  return (
    <Stack
      spacing={3}
      px={5}
      py={2}
      sx={{
        width: '100%',
        height: '100%',
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
        Observations / Next Steps
      </Typography>

      {progressData.map((item) => (
        <Box sx={{ borderRadius: 3, backgroundColor: '#EEEEEE', padding: 1 }}>
          <Stack spacing={1}>
            <Typography>
              <b>{item.date}</b>
            </Typography>
            <Typography>
              <u>Observations:</u> {item.observations}
            </Typography>
            <Typography>
              <u>Next Steps:</u> {item.next_steps}
            </Typography>
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}
