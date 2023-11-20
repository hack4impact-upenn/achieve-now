import React from 'react';
import { Grid, Stack } from '@mui/material';
import { useParams } from 'react-router-dom';
import Header from '../components/PageHeader';
import Badges from './Badges';
import Phonetics from './Phonetics';
import Attendance from './Attendance';
import ProgressSnapshot from './ProgressSnapshot';

export default function StudentProgress() {
  const { id } = useParams<{ id?: string }>();
  // return (
  //   <>
  //     <Header />
  //     {id && <ProgressSnapshot studentId={id} />}
  //   </>
  // );
  return (
    <>
      <Header />
      <Grid container spacing={4} p={5}>
        <Grid item container direction="column" xs={3} spacing={4}>
          <Grid item xs>
            <Badges />
          </Grid>
          <Grid item xs>
            <Attendance studentId="6510857e100eb371707ca8e7" />
          </Grid>
        </Grid>
        <Grid item container direction="column" xs={9} spacing={4}>
          <Grid item xs>
            <Phonetics />
          </Grid>
          <Grid item xs>
            <ProgressSnapshot studentId="6510857e100eb371707ca8e7" />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
