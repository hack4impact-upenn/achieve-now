import React from 'react';
import { Typography, Box, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import Header from '../components/PageHeader';
import theme from '../assets/theme';
import PrimaryButton from '../components/buttons/PrimaryButton';

function AdminMenu() {
  return (
    <>
      <Header />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: theme.spacing(8),
          width: '100%',
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: theme.typography.fontWeightBold,
          }}
        >
          Menu
        </Typography>
        <Grid
          container
          alignItems="center"
          spacing={3}
          justifyContent="center"
          maxWidth={757}
          sx={{
            marginTop: theme.spacing(2),
            flexGrow: 1,
          }}
        >
          <Grid
            item
            xs={6}
            alignItems="center"
            justifyContent="center"
            container
          >
            <PrimaryButton
              variant="contained"
              sx={{
                padding: `${theme.spacing(3)} ${theme.spacing(8)}`,
                margin: 'auto',
              }}
              size="large"
              href="/"
              fullWidth
            >
              Sessions
            </PrimaryButton>
          </Grid>
          <Grid
            item
            xs={6}
            alignItems="center"
            justifyContent="center"
            container
          >
            <PrimaryButton
              variant="contained"
              sx={{ padding: `${theme.spacing(3)} ${theme.spacing(8)}` }}
              size="large"
              href="/admin-profiles"
              fullWidth
            >
              Profiles
            </PrimaryButton>
          </Grid>
          <Grid
            item
            xs={6}
            alignItems="center"
            justifyContent="center"
            container
          >
            <PrimaryButton
              variant="contained"
              sx={{ padding: `${theme.spacing(3)} ${theme.spacing(8)}` }}
              size="large"
              href="/admin-attendance"
              fullWidth
            >
              Attendance
            </PrimaryButton>
          </Grid>
          <Grid
            item
            xs={6}
            alignItems="center"
            justifyContent="center"
            container
          >
            <PrimaryButton
              variant="contained"
              sx={{ padding: `${theme.spacing(3)} ${theme.spacing(8)}` }}
              size="large"
              href="/admin-curriculum"
              fullWidth
            >
              Curriculum
            </PrimaryButton>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default AdminMenu;
