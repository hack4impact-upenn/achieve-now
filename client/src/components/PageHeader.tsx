import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import { Box } from '@mui/system';
import COLORS from '../assets/colors';
import Logo from '../assets/achieve-now-logo.png';
import { URLPREFIX } from '../util/api';
import { useAppSelector } from '../util/redux/hooks';
import { selectUser, logout as logoutAction } from '../util/redux/userSlice';
import { logout, logout as logoutApi } from '../Home/api';
import AlertType from '../util/types/alert';
import useAlert from '../util/hooks/useAlert';

export default function Header() {
  const navigator = useNavigate();
  const { setAlert } = useAlert();
  const handleLogout = async () => {
    if (await logoutApi()) {
      logout();
      navigator('/login', { replace: true });
    }
  };
  const user = useAppSelector(selectUser);

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
  const handleFamilyProgress = async () => {
    const student = await axios.get(`${URLPREFIX}/user/student/${user.id}`);
    console.log(`${URLPREFIX}/user/student/${user.id}`);
    console.log(student);
    if (!student || !student.data) {
      setAlert('Error getting student', AlertType.ERROR);
    } else {
      // eslint-disable-next-line no-underscore-dangle
      const studentId = student.data._id;
      navigator(`/student/progress/${studentId}`);
    }
  };
  const handleFamilyLesson = () => {
    navigator('/student/lessons');
  };

  // Coach Onclick Functions
  const handleCoachProgress = async () => {
    const coachStudent = await axios.get(`${URLPREFIX}/user/coach/${user.id}`);
    if (!coachStudent || !coachStudent.data) {
      setAlert('Error getting student', AlertType.ERROR);
    } else {
      // eslint-disable-next-line no-underscore-dangle
      const studentId = coachStudent.data._id;
      navigator(`/coach/student-progress/${studentId}`);
    }
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
