import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import { Box } from '@mui/system';

import { ArrowBack } from '@mui/icons-material';
import COLORS from '../assets/colors';
import Logo from '../assets/achieve-now-logo.png';
import { getData, URLPREFIX } from '../util/api';
import { useAppDispatch, useAppSelector } from '../util/redux/hooks';
import { selectUser, logout as logoutAction } from '../util/redux/userSlice';
import { logout, logout as logoutApi } from '../Home/api';

export default function Header() {
  const navigator = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [studentId, setStudentId] = useState('');
  const handleLogout = async () => {
    if (await logoutApi()) {
      logout();
      navigator('/login', { replace: true });
    }
  };
  const user = useAppSelector(selectUser);
  const { role } = user;
  const path = location.pathname;
  useEffect(() => {
    const getStudentFromCoach = async () => {
      console.log(user.id);
      const res1 = await axios.get(`${URLPREFIX}/coach/user/${user.id}`);
      const res2 = await axios.get(
        // eslint-disable-next-line no-underscore-dangle
        `${URLPREFIX}/coach/student/${res1.data._id}`,
      );
      // eslint-disable-next-line no-underscore-dangle
      setStudentId(res2?.data._id);
    };
    const getStudentFromParent = async () => {
      await getData(`student/student-info/${user.id}`).then((res) => {
        // eslint-disable-next-line no-underscore-dangle
        setStudentId(res.data._id);
      });
    };
    if (user.role === 'parent') {
      getStudentFromParent();
    }
    if (user.role === 'coach') {
      getStudentFromCoach();
    }
  });

  // Admin Onclick Functions
  const handleAdminHome = () => {
    navigator('/admin-menu');
  };
  const handleAdminSessions = () => {
    navigator('/admin/sessions');
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

  // Family Onclick Functions
  const handleFamilyProgress = () => {
    navigator(`/student/progress/${studentId}`);
  };
  const handleFamilyLesson = () => {
    navigator('/student/lessons');
  };

  // Coach Onclick Functions
  const handleCoachProgress = () => {
    navigator(`/coach/student-progress/${studentId}`);
  };
  const handleCoachLesson = () => {
    navigator(`/coach/lessons`);
  };

  // Teacher Onclick Functions
  const handleTeacherProgress = () => {
    navigator(`/teacher`);
  };
  const handleTeacherInvite = () => {
    navigator(`/student-dashboard`);
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
              <Button
                sx={{
                  marginRight: '10px',
                }}
                variant="contained"
                onClick={handleAdminSessions}
              >
                Sessions
              </Button>
              <Button
                sx={{
                  marginRight: '10px',
                }}
                variant="contained"
                onClick={handleAdminAttendance}
              >
                Attendance
              </Button>
              <Button
                sx={{
                  marginRight: '10px',
                }}
                variant="contained"
                onClick={handleAdminProfiles}
              >
                Profiles
              </Button>
              <Button
                sx={{
                  marginRight: '10px',
                }}
                variant="contained"
                onClick={handleAdminCurriculum}
              >
                Curriculum
              </Button>
            </div>
          ) : (
            false
          )}
          {user && user.role === 'parent' ? (
            <div>
              <Button
                sx={{
                  marginRight: '10px',
                }}
                variant="contained"
                onClick={handleFamilyProgress}
              >
                Progress
              </Button>
              <Button
                sx={{
                  marginRight: '10px',
                }}
                variant="contained"
                onClick={handleFamilyLesson}
              >
                Lessons
              </Button>
            </div>
          ) : (
            false
          )}
          {user && user.role === 'coach' ? (
            <div>
              <Button
                sx={{
                  marginRight: '10px',
                }}
                variant="contained"
                onClick={handleCoachProgress}
              >
                Progress
              </Button>
              <Button
                sx={{
                  marginRight: '10px',
                }}
                variant="contained"
                onClick={handleCoachLesson}
              >
                Lessons
              </Button>
            </div>
          ) : (
            false
          )}
          {user && user.role === 'teacher' ? (
            <div>
              <Button
                sx={{
                  marginRight: '10px',
                }}
                variant="contained"
                onClick={handleTeacherProgress}
              >
                Progress
              </Button>
              <Button
                sx={{
                  marginRight: '10px',
                }}
                variant="contained"
                onClick={handleTeacherInvite}
              >
                Students
              </Button>
            </div>
          ) : (
            false
          )}
          <Button
            sx={{
              marginRight: '10px',
            }}
            variant="contained"
            onClick={handleLogout}
          >
            Log Out
          </Button>
        </div>
      </AppBar>
    </Box>
  );
}
