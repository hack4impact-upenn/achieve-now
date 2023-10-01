import React from 'react';
import { Typography, Grid } from '@mui/material';
import ScreenGrid from '../components/ScreenGrid';
import SessionsTable from './UserTable';
import InviteUserButton from '../components/buttons/InviteUserButton';

/**
 * A page only accessible to admins that displays all users in a table and allows
 * Admin to delete users from admin and promote users to admin.
 */
function AdminSessionsPage() {
  return (
    <ScreenGrid>
      <Grid item>
        <Typography variant="h5">Welcome to the Admin Sessions</Typography>
      </Grid>
      <Grid item>
        <div style={{ height: '60vh', width: '60vw' }}>
          <SessionsTable />
        </div>
      </Grid>
    </ScreenGrid>
  );
}

export default AdminSessionsPage;
