import React, { useEffect, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { useData } from '../util/api';

export default function ProgressSnapshot({ studentId }: { studentId: string }) {
  const arr = [
    {
      date: '12/28/2022',
      observations:
        'Observation for 12/28/2022, showing progress in learning activities.',
      next_steps:
        'Continue with the current learning plan and review previous materials.',
    },
    {
      date: '11/24/2022',
      observations:
        'Observation for 11/24/2022, showing progress in learning activities.',
      next_steps:
        'Continue with the current learning plan and review previous materials.',
    },
    {
      date: '02/04/2023',
      observations:
        'Observation for 02/04/2023, showing progress in learning activities.',
      next_steps:
        'Continue with the current learning plan and review previous materials.',
    },
    {
      date: '03/17/2023',
      observations:
        'Observation for 03/17/2023, showing progress in learning activities.',
      next_steps:
        'Continue with the current learning plan and review previous materials.',
    },
    {
      date: '06/25/2023',
      observations:
        'Observation for 06/25/2023, showing progress in learning activities.',
      next_steps:
        'Continue with the current learning plan and review previous materials.',
    },
  ];

  return (
    <>
      <div style={{ height: '50px' }} />
      <Stack
        sx={{
          width: '100%',
          height: '100%',
          border: 1,
          borderRadius: 3,
          padding: 3,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Observations / Next Steps
        </Typography>
        <Stack />
      </Stack>
    </>
  );
}
