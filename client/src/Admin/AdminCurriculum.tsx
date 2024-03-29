import React, { useEffect, useState } from 'react';
import { Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/PageHeader';
import theme from '../assets/theme';
import PrimaryButton from '../components/buttons/PrimaryButton';
import { useAppDispatch, useAppSelector } from '../util/redux/hooks';
import { selectUser, logout as logoutAction } from '../util/redux/userSlice';
import { URLPREFIX } from '../util/api';

function AdminCurriculum() {
  const [firstStudent, setStudent] = useState('');
  const [firstLesson, setLesson] = useState('');
  const user = useAppSelector(selectUser);
  useEffect(() => {
    const assignLesson = async () => {
      const res = await axios.get(`${URLPREFIX}/lesson/all`);
      // eslint-disable-next-line no-underscore-dangle
      setLesson(res.data[0]._id);
    };
    const assignStudent = async () => {
      const res = await axios.get(`${URLPREFIX}/admin/all`);
      // eslint-disable-next-line no-plusplus
      for (let i = res.data.length - 1; i >= 0; i--) {
        if (res.data[i].role === 'parent') {
          // eslint-disable-next-line no-underscore-dangle
          setStudent(res.data[i]._id);
          break;
        }
      }
    };
    assignStudent();
    assignLesson();
  });
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
          Curriculum
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
            sx={{ padding: `${theme.spacing(3)} ${theme.spacing(8)}` }}
            size="large"
            href={`/resources/lesson/${firstLesson}`}
            fullWidth
          >
            Assign Lessons
          </PrimaryButton>
          <PrimaryButton
            fullWidth
            variant="contained"
            sx={{ padding: `${theme.spacing(3)} ${theme.spacing(8)}` }}
            size="large"
            href={`/resources/student/${firstStudent}`}
          >
            Assign Additional Resources
          </PrimaryButton>
          <PrimaryButton
            fullWidth
            variant="contained"
            sx={{ padding: `${theme.spacing(3)} ${theme.spacing(8)}` }}
            size="large"
            href="/admin-resources"
          >
            Manage Resources
          </PrimaryButton>
          <PrimaryButton
            fullWidth
            variant="contained"
            sx={{ padding: `${theme.spacing(3)} ${theme.spacing(8)}` }}
            size="large"
            href="/lesson-dashboard"
          >
            Manage Lessons
          </PrimaryButton>
        </Box>
      </Box>
    </>
  );
}

export default AdminCurriculum;
