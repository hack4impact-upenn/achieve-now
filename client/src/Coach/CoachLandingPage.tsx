import { Box, Button, Card, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/PageHeader';

const fieldsMapping = {
  teacher: 'Teacher',
  grade: 'Grade',
  work_habits: 'Work Habits',
  personality: 'Personality & Interests',
  family: 'Family',
  fav_food: 'Favorite Food',
  likes: 'Likes',
  dislikes: 'Dislikes',
  motivation: 'What Motivates Them',
  good_strategies: 'What Reading Strategies Worked',
  bad_strategies: "What Reading Strategies Didn't Work",

  school_name: 'School Name',
  school_info: 'School Info',
};

function CoachLandingPage() {
  const params = useParams();
  const [coach, setCoach] = useState<any>({});
  const [student, setStudent] = useState<any>({});

  const openLink = (link: string) => {
    window.open(link);
  };

  useEffect(() => {
    if (!params.id) {
      return;
    }

    const fetchInfo = async () => {
      let res = await axios.get(`http://localhost:4000/api/coach/${params.id}`);

      let res2 = await axios.get(
        `http://localhost:4000/api/user/${res.data.user_id}`,
      );
      setCoach({
        ...res.data,
        ...res2.data,
      });

      res = await axios.get(
        `http://localhost:4000/api/coach/student/${params.id}`,
      );

      res2 = await axios.get(
        `http://localhost:4000/api/user/${res.data.user_id}`,
      );

      const teacherRes = await axios.get(
        `http://localhost:4000/api/user/${res.data.teacher_id}`,
      );

      const schoolRes = await axios.get(
        `http://localhost:4000/api/school/${res.data.school_id}`,
      );

      const blockRes = await axios.get(
        `http://localhost:4000/api/block/student/${res.data.user_id}`,
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
  }, [params.id]);

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
            {Object.entries(fieldsMapping).map(
              (entry) =>
                student[entry[0]] && (
                  <Typography variant="body1">
                    <strong>{entry[1]}: </strong>
                    {student[entry[0]]}
                  </Typography>
                ),
            )}
          </Stack>
        </Card>
      </Stack>
    </>
  );
}

export default CoachLandingPage;
