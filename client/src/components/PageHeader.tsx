import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import { Box } from '@mui/system';

import { ArrowBack } from '@mui/icons-material';
import COLORS from '../assets/colors';
import Logo from '../assets/achieve-now-logo.png';

import { useAppDispatch, useAppSelector } from '../util/redux/hooks';
import { selectUser, logout as logoutAction } from '../util/redux/userSlice';
import { logout, logout as logoutApi } from '../Home/api';

export default function Header() {
  const navigator = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const handleLogout = async () => {
    if (await logoutApi()) {
      logout();
      navigator('/login', { replace: true });
    }
  };
  const user = useAppSelector(selectUser);
  console.log(user);
  const path = location.pathname;
  const handleAdminHome = () => {
    navigator('/admin-menu');
  };
  const handleAdminSessions = () => {
    navigator('/admin-sessions');
  };
  const handleAdminAttendance = () => {
    navigator('/admin-attendance');
  };
  const handleAdminProfiles = () => {
    navigator('/admin-profiles');
  };
  const handleAdminCurriculum = () => {
    navigator('/admin-curriculum');
  };
  const handleBackButton = () => {
    navigator(-1);
  };
  const noBackButton = [
    '/admin-sessions',
    '/admin-attendance',
    '/admin-profiles',
    '/admin-curriculum',
    '/admin-menu',
  ];
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
        <div>
          <Button onClick={handleAdminHome}>
            <img alt="achieve now logo" src={Logo} width={95} height={44} />
          </Button>
          {!noBackButton.includes(path) ? (
            <Button
              sx={{ color: 'white', borderColor: 'white', marginRight: '10px' }}
              variant="outlined"
              color="primary"
              onClick={handleBackButton}
            >
              <ArrowBack />
            </Button>
          ) : (
            <div />
          )}
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginTop: 'auto',
            marginBottom: 'auto',
          }}
        >
          {user && user.role === 'admin' ? (
            <div>
              {path !== '/admin-sessions' ? (
                <Button
                  sx={{
                    color: 'white',
                    borderColor: 'white',
                    marginRight: '10px',
                  }}
                  variant="outlined"
                  color="primary"
                  onClick={handleAdminSessions}
                >
                  Sessions
                </Button>
              ) : (
                false
              )}
              {path !== '/admin-attendance' ? (
                <Button
                  sx={{
                    color: 'white',
                    borderColor: 'white',
                    marginRight: '10px',
                  }}
                  variant="outlined"
                  color="primary"
                  onClick={handleAdminAttendance}
                >
                  Attendance
                </Button>
              ) : (
                false
              )}
              {path !== '/admin-profiles' ? (
                <Button
                  sx={{
                    color: 'white',
                    borderColor: 'white',
                    marginRight: '10px',
                  }}
                  variant="outlined"
                  color="primary"
                  onClick={handleAdminProfiles}
                >
                  Profiles
                </Button>
              ) : (
                false
              )}
              {path !== '/admin-curriculum' ? (
                <Button
                  sx={{
                    color: 'white',
                    borderColor: 'white',
                    marginRight: '10px',
                  }}
                  variant="outlined"
                  color="primary"
                  onClick={handleAdminCurriculum}
                >
                  Curriculum
                </Button>
              ) : (
                false
              )}
            </div>
          ) : (
            false
          )}
          <Button
            sx={{ color: 'white', borderColor: 'white', marginRight: '10px' }}
            variant="outlined"
            color="primary"
            onClick={handleLogout}
          >
            Log Out
          </Button>
        </div>
      </AppBar>
    </Box>
  );
}
