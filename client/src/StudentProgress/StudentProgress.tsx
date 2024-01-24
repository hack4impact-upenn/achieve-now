import React, { useEffect } from 'react';
import { Grid, Skeleton } from '@mui/material';
import { useParams } from 'react-router-dom';
import Header from '../components/PageHeader';
import Badges from './Badges';
import Phonetics from './Phonetics';
import Attendance from './Attendance';
import ProgressSnapshot from './ProgressSnapshot';
import Updates from './Updates';
import ProgressBar from './ProgressBar';
import useAlert from '../util/hooks/useAlert';
import AlertType from '../util/types/alert';

export default function StudentProgress() {
  const { id } = useParams<{ id?: string }>();
  const { setAlert } = useAlert();

  useEffect(() => {
    if (!id || id === 'undefined') {
      setAlert('Student ID is not valid', AlertType.ERROR);
    }
  });

  return (
    <>
      <Header />
      <Grid container spacing={3} p={5}>
        {!id || id === 'undefined' ? (
          <Skeleton />
        ) : (
          <>
            <Grid item container xs={12} spacing={3}>
              <Grid item xs={12} md={3}>
                <Grid container direction="column" spacing={3}>
                  <Grid item xs={12}>
                    <Badges studentId={id} />
                  </Grid>
                  <Grid item xs={12}>
                    <Attendance studentId={id} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={9}>
                <Grid container direction="column" spacing={3}>
                  <Grid item container spacing={3} xs={3}>
                    <Grid item xs={12} md={9}>
                      <Updates studentId={id} />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Phonetics />
                    </Grid>
                  </Grid>
                  <Grid item xs={9}>
                    <ProgressSnapshot studentId={id} />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item container xs={12}>
              <Grid item xs={12}>
                <ProgressBar studentId={id} />
              </Grid>
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
}
