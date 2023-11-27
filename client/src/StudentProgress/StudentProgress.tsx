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

  const firstColumnRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState(0);

  useEffect(() => {
    if (firstColumnRef.current && rowRef.current) {
      setMaxHeight(
        firstColumnRef.current.clientHeight - rowRef.current.clientHeight,
      );
    }
  }, []);

  return (
    <>
      <Header />
      <Grid container spacing={3} p={5}>
        <Grid item container xs={12} spacing={3}>
          <Grid item xs={12} md={3}>
            <Grid container direction="column" spacing={3} ref={firstColumnRef}>
              <Grid item xs={12}>
                <Badges />
              </Grid>
              <Grid item xs={12}>
                <Attendance studentId={validId} />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={9}>
            <Grid container direction="column" spacing={3} sx={{}}>
              <Grid item container spacing={3} ref={rowRef}>
                <Grid item xs={12} md={9}>
                  <Updates studentId={validId} />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Phonetics />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    maxHeight: `${maxHeight}px`,
                    overflowY: 'auto',
                    width: '100%',
                    border: 1,
                    borderRadius: 3,
                  }}
                >
                  <ProgressSnapshot studentId={validId} />
                </Box>
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
