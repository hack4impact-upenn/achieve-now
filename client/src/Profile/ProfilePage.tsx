import React from 'react';
import { Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ScreenGrid from '../components/ScreenGrid';
import ProfileTable from './ProfileTable';
import Header from '../components/PageHeader';
import InviteUserButton from '../components/buttons/InviteUserButton';

function ProfilePage() {
  return (
    <>
      <Header />
      <ScreenGrid>
        <Grid item>
          <Typography variant="h2">User Profiles</Typography>
        </Grid>
        <Grid item>
          <div style={{ height: '60vh', width: '60vw' }}>
            <ProfileTable />
          </div>
        </Grid>
      </ScreenGrid>
    </>
  );
}

export default ProfilePage;
