import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';

export default function Badges() {
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
      <Typography variant="h6" fontWeight={700}>
        Badges
      </Typography>
      <Grid container spacing={2} mt={1}>
        <Grid item container xs={6} justifyContent="space-evenly">
          <img src="/first_session.svg" alt="" />
        </Grid>
        <Grid item container xs={6} justifyContent="space-evenly">
          <img src="/vowels.svg" alt="" />
        </Grid>
        <Grid item container xs={6} justifyContent="space-evenly">
          <img src="/ten_sessions.svg" alt="" />
        </Grid>
      </Grid>
    </Box>
  );
}
