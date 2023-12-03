import React, { useEffect, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { useData } from '../util/api';

function Attendance({ studentId }: { studentId: string }) {
  const [absentCount, setAbsentCount] = useState(0);
  const [presentCount, setPresentCount] = useState(0);

  const student = useData(`student/student/${studentId}`);

  useEffect(() => {
    if (student?.data.progress_stats.attendance) {
      const { attendance } = student.data.progress_stats;

      let absentCnt = 0;
      Object.values(attendance).forEach((status) => {
        if (status) {
          absentCnt += 1;
        }
      });

      const totalSessions = Object.keys(attendance).length;
      const presentCnt = totalSessions - absentCnt;

      setPresentCount(presentCnt);
      setAbsentCount(absentCnt);
    }
  }, [student]);

  return (
    <Stack
      sx={{
        height: '100%',
        border: 1,
        borderRadius: 3,
        padding: 3,
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
        Attendance
      </Typography>
      <Typography variant="subtitle1" sx={{ fontSize: '12px' }} color="#5A5A5A">
        How many sessions the student attended or missed.
      </Typography>
      <Box
        sx={{
          marginTop: 3,
          marginBottom: 1,
          padding: 0,
          width: '100%',
          height: '50px',
          display: 'flex',
        }}
      >
        <div style={{ flex: presentCount, backgroundColor: '#F5773C' }} />
        <div style={{ flex: absentCount, backgroundColor: '#00A7A7' }} />
      </Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <Typography
          variant="subtitle1"
          color="#5A5A5A"
          sx={{ fontWeight: 'bold' }}
        >
          Present
        </Typography>
        <Typography
          variant="subtitle1"
          color="#5A5A5A"
          sx={{ fontWeight: 'bold' }}
        >
          Absent
        </Typography>
      </Stack>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <Typography variant="subtitle1" color="#5A5A5A">
          {presentCount}
        </Typography>
        <Typography variant="subtitle1" color="#5A5A5A">
          {absentCount}
        </Typography>
      </Stack>
      <Box mt={4}>
        <Typography variant="h6" color="#5A5A5A" sx={{ fontWeight: 'bold' }}>
          Total Sessions
        </Typography>
        <Typography variant="h3" color="#3C618F" sx={{ fontWeight: 'bold' }}>
          {presentCount + absentCount}
        </Typography>
      </Box>
    </Stack>
  );
}

export default Attendance;
