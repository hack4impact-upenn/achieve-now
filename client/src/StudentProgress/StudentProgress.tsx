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
      <Grid container spacing={3} p={4}>
        <Grid item container xs={4} rowSpacing={3} columnSpacing={3}>
          <Grid item xs={12}>
            <Badges />
          </Grid>
          <Grid item xs={12}>
            <Attendance studentId="6510857e100eb371707ca8e7" />
          </Grid>
        </Grid>
        <Grid item container xs={8} rowSpacing={3} columnSpacing={0}>
          <Grid item xs={12}>
            <Phonetics />
          </Grid>
          <Grid item xs={12}>
            <ProgressSnapshot studentId="6510857e100eb371707ca8e7" />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
