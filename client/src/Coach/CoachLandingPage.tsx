import { Box, Button, Card, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/PageHeader';
import { useAppSelector } from '../util/redux/hooks';
import { selectUser } from '../util/redux/userSlice';
import { URLPREFIX } from '../util/api';

const fieldsMapping = {
  teacher: 'Teacher',
  grade: 'Grade',
  best_communication_method: 'Best Communication Method',
  work_habits: 'Work Habits',
  personality: 'Personality & Interests',
  family: 'Family',
  fav_food: 'Favorite Food',
  likes: 'Likes',
  dislikes: 'Dislikes',
  motivation: 'What Motivates Them',
  good_strategies: 'What Reading Strategies Worked',
  bad_strategies: "What Reading Strategies Didn't Work",
};

const schoolFieldsMapping = {
  school_name: 'School Name',
  school_info: 'School Info',
};

function CoachLandingPage() {
  const { id } = useAppSelector(selectUser);
  console.log(id);
  const [coach, setCoach] = useState<any>({});
  const [student, setStudent] = useState<any>({});

  const openLink = (link: string) => {
    window.open(link);
  };

  useEffect(() => {
    const fetchInfo = async () => {
      let res = await axios.get(`${URLPREFIX}/coach/user/${id}`);

      let res2 = await axios.get(`${URLPREFIX}/user/id/${res.data.user_id}`);
      setCoach({
        ...res.data,
        ...res2.data,
      });

      res = await axios.get(
        // eslint-disable-next-line no-underscore-dangle
        `${URLPREFIX}/coach/student/${res.data._id}`,
      );

      res2 = await axios.get(`${URLPREFIX}/user/id/${res.data.user_id}`);

      const teacherRes = await axios.get(
        `${URLPREFIX}/user/id/${res.data.teacher_id}`,
      );

      const schoolRes = await axios.get(
        `${URLPREFIX}/school/${res.data.school_id}`,
      );

      const blockRes = await axios.get(
        `${URLPREFIX}/block/student/${res.data.user_id}`,
      );

      setStudent({
        ...res.data,
        ...res2.data,
        school_name: schoolRes.data.name,
        school_info: schoolRes.data.info,
        teacher: `${teacherRes.data.firstName} ${teacherRes.data.lastName}`,
        zoom_link: blockRes.data.zoom,
      });
    };

    fetchInfo();
  }, [id]);

  return (
    <>
      <Header />
      <Stack
        direction="column"
        sx={{
          padding: '1rem 3rem 2rem 3rem',
        }}
        spacing={2}
      >
        <Box
          sx={{
            justifyContent: 'space-between',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography variant="h3">{student.firstName}</Typography>
          <Box>
            <Button
              variant="outlined"
              onClick={() => openLink(student.zoom_link)}
              sx={{ marginRight: '1rem' }}
            >
              Absence Notification
            </Button>
            <Button
              variant="outlined"
              onClick={() => openLink(student.zoom_link)}
              sx={{ marginRight: '1rem' }}
            >
              Exit Ticket
            </Button>
            <Button
              variant="outlined"
              onClick={() => openLink(student.zoom_link)}
              sx={{ marginRight: '1rem' }}
            >
              Zoom
            </Button>
          </Box>
        </Box>
        <Card
          variant="outlined"
          sx={{
            padding: '1rem',
            border: '1px solid black',
          }}
        >
          <Stack direction="column">
            <Typography variant="body1">
              <strong>Updates:</strong>
            </Typography>
            <Typography variant="body1">
              {coach.updates || 'No updates'}
            </Typography>
          </Stack>
        </Card>
        <Card
          variant="outlined"
          sx={{
            padding: '1rem',
            border: '1px solid black',
          }}
        >
          <Stack direction="column">
            {Object.entries(fieldsMapping).map((entry) => (
              <Typography variant="body1">
                <strong>{entry[1]}: </strong>
                {student[entry[0]]}
              </Typography>
            ))}
            <Typography variant="body1">
              <br />
            </Typography>
            {Object.entries(schoolFieldsMapping).map((entry) => (
              <Typography variant="body1">
                <strong>{entry[1]}: </strong>
                {student[entry[0]]}
              </Typography>
            ))}
          </Stack>
        </Card>
      </Stack>
    </>
  );
}

export default CoachLandingPage;
