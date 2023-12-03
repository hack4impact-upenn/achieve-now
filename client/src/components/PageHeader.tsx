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
  const path = location.pathname;
  // Admin Onclick Functions
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

  // Family Onclick Functions
  const handleFamilyProgress = () => {
    navigator('/lessons');
  };
  const handleFamilyLesson = () => {
    navigator('/progress');
  };
  const noBackButton = [
    '/admin-sessions',
    '/admin-attendance',
    '/admin-profiles',
    '/admin-curriculum',
    '/admin-menu',
    '/progress',
    '/lessons',
    '/coach-landing',
  ];
  const checkIfBackButton = (paths: string) => {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < noBackButton.length; i++) {
      if (paths.includes(noBackButton[i])) {
        return false;
      }
    }
    return true;
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
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginTop: 'auto',
            marginBottom: 'auto',
          }}
        >
          {user && user.role === 'admin' ? (
            <Button onClick={handleAdminHome}>
              <img alt="achieve now logo" src={Logo} width={95} height={44} />
            </Button>
          ) : (
            <img
              alt="achieve now logo"
              src={Logo}
              width={95}
              height={44}
              style={{
                marginTop: 'auto',
                marginBottom: 'auto',
                marginRight: '10px',
              }}
            />
          )}
          {checkIfBackButton(path) ? (
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
          {user && user.role === 'family' ? (
            <div>
              {!location.pathname.includes('/progress') ? (
                <Button
                  sx={{
                    color: 'white',
                    borderColor: 'white',
                    marginRight: '10px',
                  }}
                  variant="outlined"
                  color="primary"
                  onClick={handleFamilyProgress}
                >
                  Progress
                </Button>
              ) : (
                false
              )}
              {!location.pathname.includes('/lessons') ? (
                <Button
                  sx={{
                    color: 'white',
                    borderColor: 'white',
                    marginRight: '10px',
                  }}
                  variant="outlined"
                  color="primary"
                  onClick={handleFamilyLesson}
                >
                  Lessons
                </Button>
              ) : (
                false
              )}
            </div>
          ) : (
            false
          )}
          {user && user.role === 'coach' ? (
            <div>
              {!location.pathname.includes('/progress') ? (
                <Button
                  sx={{
                    color: 'white',
                    borderColor: 'white',
                    marginRight: '10px',
                  }}
                  variant="outlined"
                  color="primary"
                >
                  Progress
                </Button>
              ) : (
                false
              )}
              {!location.pathname.includes('/lessons') ? (
                <Button
                  sx={{
                    color: 'white',
                    borderColor: 'white',
                    marginRight: '10px',
                  }}
                  variant="outlined"
                  color="primary"
                >
                  Lessons
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
