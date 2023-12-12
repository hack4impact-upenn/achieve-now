import React from 'react';
import { Typography, Grid } from '@mui/material';
import ScreenGrid from '../components/ScreenGrid';
import LessonTable from './LessonTable';
import PageHeader from '../components/PageHeader';
import AddLessonButton from './AddLesson';
import EditLessonButton from './EditLesson';
import DeleteLessonButton from './DeleteLesson';

/**
 * A page only accessible to admins that displays all users in a table and allows
 * Admin to delete users from admin and promote users to admin.
 */
function LessonDashboardPage() {
  return (
    <div>
      <PageHeader />
      <ScreenGrid>
        <Grid item>
          <Typography variant="h2">Lessons</Typography>
        </Grid>
        <Grid
          item
          container
          width="60vw"
          justifyContent="flex-end"
          spacing={0.5}
        >
          <Grid item>
            <AddLessonButton />
          </Grid>
          <Grid item>
            <EditLessonButton />
          </Grid>
          <Grid item>
            <DeleteLessonButton />
          </Grid>
        </Grid>
        <Grid item>
          <div style={{ height: '60vh', width: '60vw' }}>
            <LessonTable />
          </div>
        </Grid>
      </ScreenGrid>
    </div>
  );
}

export default LessonDashboardPage;
