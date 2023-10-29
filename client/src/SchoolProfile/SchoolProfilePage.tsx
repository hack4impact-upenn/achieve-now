import React from 'react';
import { Typography, Grid } from '@mui/material';
import ScreenGrid from '../components/ScreenGrid';
import SchoolProfileTable from './SchoolProfileTable';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

function SchoolProfilePage() {
  const navigate = useNavigate();
  function handleClick() {
    const s = `/users`;
    navigate(s);
  }

  return (
    <ScreenGrid>
      <Grid item>
        <Typography variant="h2">School Profiles</Typography>
      </Grid>
      <Grid item container width="60vw" justifyContent="flex-end">
        <Button variant="outlined" onClick={handleClick}>
          Delete School
        </Button>
        <Button variant="outlined" onClick={handleClick}>
          Add School
        </Button>
      </Grid>
      <Grid item>
        <div style={{ height: '60vh', width: '60vw' }}>
          <SchoolProfileTable />
        </div>
      </Grid>
    </ScreenGrid>
  );
}

export default SchoolProfilePage;
