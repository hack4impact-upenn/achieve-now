import React from 'react';
import { Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import Header from '../components/PageHeader';
import theme from '../assets/theme';
import PrimaryButton from '../components/buttons/PrimaryButton';

function AdminProfiles() {
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
          Profiles
        </Typography>
        <Box
          sx={{
            marginTop: theme.spacing(2),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <PrimaryButton
            variant="contained"
            fullWidth
            sx={{ padding: `${theme.spacing(3)} ${theme.spacing(8)}` }}
            size="large"
            href="/admin/profiles"
          >
            Users
          </PrimaryButton>
          <PrimaryButton
            variant="contained"
            sx={{ padding: `${theme.spacing(3)} ${theme.spacing(8)}` }}
            size="large"
            href="/school/profiles"
          >
            Schools
          </PrimaryButton>
        </Box>
      </Box>
    </>
  );
}

export default AdminProfiles;
