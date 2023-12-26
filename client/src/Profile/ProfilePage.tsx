import React from 'react';
import { Typography, Grid } from '@mui/material';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import ScreenGrid from '../components/ScreenGrid';
import ProfileTable from './ProfileTable';
import Header from '../components/PageHeader';

function ProfilePage() {
  const navigate = useNavigate();
  function handleClick() {
    const s = `/users`;
    navigate(s);
  }

  return (
    <>
      <Header />
      <ScreenGrid>
        <Grid item>
          <Typography variant="h2">User Profiles</Typography>
        </Grid>
        <Grid item container width="60vw" justifyContent="flex-end">
          {/* eslint-disable-next-line */}
            <Button variant="outlined" onClick={handleClick}>
            Invite User
          </Button>
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
