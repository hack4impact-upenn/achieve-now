import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import { Box } from '@mui/system';

import COLORS from '../assets/colors';
import Logo from '../assets/achieve-now-logo.png';

import { useAppDispatch, useAppSelector } from '../util/redux/hooks';
import { selectUser, logout as logoutAction } from '../util/redux/userSlice';
import { logout as logoutApi } from '../Home/api';

export default function Header() {
  const navigator = useNavigate();

  const handleLogin = () => {
    navigator('/login');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: COLORS.primaryDark,
          paddingX: '16px',
          paddingY: '11px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <img alt="achieve now logo" src={Logo} width={95} height={44} />
        <Button
          sx={{ color: 'white', borderColor: 'white' }}
          variant="outlined"
          color="primary"
          onClick={handleLogin}
        >
          Log Out
        </Button>
      </AppBar>
    </Box>
  );
}
