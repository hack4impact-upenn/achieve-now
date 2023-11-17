import React from 'react';
import { Grid, Typography } from '@mui/material';
import { Update } from '@material-ui/icons';
import { useParams } from 'react-router-dom';
import Header from '../components/PageHeader';
import Badges from './Badges';
import Phonetics from './Phonetics';

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
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Badges />
        </Grid>
        <Grid item xs={8}>
          <Update />
        </Grid>
        <Grid item xs={1}>
          <Phonetics />
        </Grid>
        <Grid item xs={12}>
          Observe
        </Grid>
      </Grid>
    </>
  );
}
