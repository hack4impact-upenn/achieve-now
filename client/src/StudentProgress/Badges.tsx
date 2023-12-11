import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import { useData } from '../util/api';

export default function Badges({ studentId }: { studentId: string }) {
  const studentResponse = useData(`student/student/${studentId}`);
  const badges: string[] = studentResponse?.data.badges || [];
  const generateBadgePath = (badgeName: string) => {
    return `/badges/${badgeName}.jpg`;
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        border: '1px solid black',
        borderRadius: '10px',
        padding: '16px',
        maxHeight: '400px',
        overflowY: 'auto',
      }}
    >
      <Typography variant="h5" fontWeight={700}>
        Badges
      </Typography>
      <Grid container spacing={2} mt={1}>
        {badges.map((badgeName) => {
          return (
            <Grid
              item
              container
              xs={6}
              justifyContent="space-evenly"
              key={badgeName}
              style={{
                display: badgeName ? 'flex' : 'none',
              }}
            >
              <img
                style={{ width: '150px', height: '150px' }}
                src={generateBadgePath(badgeName)}
                alt={`Badge ${badgeName}`}
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
