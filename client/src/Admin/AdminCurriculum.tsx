import React, { useEffect, useState } from 'react';
import { Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/PageHeader';
import theme from '../assets/theme';
import PrimaryButton from '../components/buttons/PrimaryButton';
import { useAppDispatch, useAppSelector } from '../util/redux/hooks';
import { selectUser, logout as logoutAction } from '../util/redux/userSlice';

function AdminCurriculum() {
  const [firstStudent, setStudent] = useState('');
  const [firstLesson, setLesson] = useState('');
  const user = useAppSelector(selectUser);
  useEffect(() => {
    const assignLesson = async () => {
      const res = await axios.get('http://localhost:4000/api/lesson/all');
      console.log(res.data);
      // eslint-disable-next-line no-underscore-dangle
      setLesson(res.data[0]._id);
    };
    const assignStudent = async () => {
      const res = await axios.get('http://localhost:4000/api/admin/all');
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].role === 'student') {
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
            Edit/Add Resources
          </PrimaryButton>
        </Box>
      </Box>
    </>
  );
}

export default AdminCurriculum;
