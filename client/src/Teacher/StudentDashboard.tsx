import React from 'react';
import { Typography, Grid } from '@mui/material';
import Box from '@mui/material/Box';
import ScreenGrid from '../components/ScreenGrid';
import StudentTable from './StudentTable';
import InviteStudentButton from '../components/buttons/InviteStudentButton';
import PageHeader from '../components/PageHeader';

/**
 * A page only accessible to admins that displays all users in a table and allows
 * Admin to delete users from admin and promote users to admin.
 */
function StudentDashboardPage() {
  return (
    <Box>
      <PageHeader />
      <ScreenGrid>
        <Grid item>
          <Typography variant="h2">Welcome to the Student Dashboard</Typography>
        </Grid>
        <Grid item container width="60vw" justifyContent="flex-end">
          <InviteStudentButton />
        </Grid>
        <Grid item>
          <div style={{ height: '60vh', width: '60vw' }}>
            <StudentTable />
          </div>
        </Grid>
      </ScreenGrid>
    </Box>
  );
}

export default StudentDashboardPage;
