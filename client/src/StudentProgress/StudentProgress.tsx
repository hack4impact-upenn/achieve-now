import React, { useRef, useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import Header from '../components/PageHeader';
import Badges from './Badges';
import Phonetics from './Phonetics';
import Attendance from './Attendance';
import ProgressSnapshot from './ProgressSnapshot';
import Updates from './Updates';
import ProgressBar from './ProgressBar';

export default function StudentProgress() {
  const { id } = useParams<{ id?: string }>();
  const validId = id ?? '';

  return (
    <>
      <Header />
      <Grid container spacing={3} p={5}>
        <Grid item container xs={12} spacing={3}>
          <Grid item xs={12} md={3}>
            <Grid container direction="column" spacing={3}>
              <Grid item xs={12}>
                <Badges studentId={validId} />
              </Grid>
              <Grid item xs={12}>
                <Attendance studentId={validId} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={9}>
            <Grid container direction="column" spacing={3}>
              <Grid item container spacing={3} xs={3}>
                <Grid item xs={12} md={9}>
                  <Updates studentId={validId} />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Phonetics />
                </Grid>
              </Grid>
              <Grid item xs={9}>
                <ProgressSnapshot studentId={validId} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item container xs={12}>
          <Grid item xs={12}>
            <ProgressBar studentId={validId} />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
