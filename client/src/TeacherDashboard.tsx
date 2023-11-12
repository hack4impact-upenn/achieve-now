import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';
import { useNavigate, useParams } from 'react-router-dom';
// eslint-disable-next-line
import { useData } from './util/api';
import { StudentCardFromID } from './Admin/StudentCard';
import PageHeader from './components/PageHeader';
import PhoneticsTable from './components/buttons/PhoneticsTable';
import { Grid } from '@mui/material';
import LessonLevels from './components/LessonLevels';

const ScrollableBox = styled(Box)({
  overflowY: 'auto',
  maxHeight: '100%',
});

// eslint-disable-next-line
function createData(data: any) {
  return data.map((student: any) => {
    return <StudentCardFromID studentID={student.user_id} lesson="Lesson 1" />;
  });
}
function StudentName(props: any) {
  const { id } = props;
  const user = useData(`user/${id}`);
  return (
    <Typography color="text-primary" sx={{ fontSize: 20, color: 'black' }}>
      {user?.data.firstName} {user?.data.lastName}
    </Typography>
  );
}
function StudentConcernsCard(props: any) {
  const { students, title, description } = props;
  const [showMore, setShowMore] = useState(false);
  return (
    <Card sx={{ marginBotom: '30px' }}>
      <CardContent sx={{ marginBotom: '30px' }}>
        <Typography
          color="text-primary"
          sx={{ fontSize: 30, fontWeight: 'bold' }}
        >
          {title}
        </Typography>
        <Typography color="text-secondary" sx={{ fontSize: 17 }}>
          {description}
        </Typography>
        <div style={{ marginTop: '10px' }}>
          {students
            .slice(0, showMore ? students.length : 3)
            .map((student: any) => {
              return <StudentName id={student.user_id} />;
            })}
        </div>
        {students.length > 3 && (
          <Button
            onClick={() => setShowMore(!showMore)}
            variant="contained"
            sx={{ marginTop: '10px' }}
          >
            {' '}
            {showMore ? 'Show Less' : 'Show More'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function SplitGrid() {
  const id = '111';
  // const students = useData(`student/teacher/${id}`);
  // const studentData = students?.data ?? [];

  const { teacherID } = useParams();
  let final_id = '111';
  if (teacherID) {
    final_id = teacherID;
  }
  const students = useData(`student/teacher/${final_id}`);
  const studentData = students?.data ?? [];

  // const student_users = []
  // for (let i = 0; i < studentData.length; i++) {
  //   const user_id = studentData[i].user_id;
  //   const user = useData(`users/${id}`);
  //   student_users.push(user);
  // }
  const academicFlags = studentData.filter(
    (student: any) => student.progressFlag,
  );
  const attendanceFlags = studentData.filter(
    (student: any) => student.attendanceFlag,
  );

  return (
    <Box>
      <PageHeader />
      <Box display="flex" flexDirection="column" width="100%" height="100vh">
        <Box display="flex" flexGrow={5}>
          <Paper
            sx={{
              width: '30%',
              overflowY: 'auto',
              maxHeight: 'calc(100vh - 64px)', // Subtract the Toolbar height (default is 64px)
              bgcolor: 'white',
              p: 2,
            }}
            elevation={0}
            square
          >
            <h2>Students</h2>
            {createData(studentData)}
          </Paper>

          <Paper
            sx={{
              width: '70%',
              overflowY: 'auto',
              maxHeight: 'calc(100vh - 64px)', // Subtract the Toolbar height (default is 64px)
              bgcolor: '#EDEDED',
              p: 2,
              paddingX: 4,
            }}
            elevation={0}
            square
          >
            <h2>Class Progress</h2>
            <Grid item xs={8}>
              {academicFlags.length > 0 && ( // TODO: Passed in teacher ID
                <StudentConcernsCard
                  students={academicFlags}
                  title="Academic Concerns"
                  description="Students with a poor academic progress pattern"
                />
              )}
            </Grid>
            <Grid item xs={8}>
              {attendanceFlags.length > 0 && (
                <div style={{ marginTop: '10px' }}>
                  <StudentConcernsCard
                    students={attendanceFlags}
                    title="Attendance Concerns"
                    description="Students with a poor attendance pattern"
                  />
                </div>
              )}
            </Grid>
            <Grid item xs={8}>
              <PhoneticsTable teacherID={final_id} />
            </Grid>
            <Grid item xs={8}>
              <LessonLevels/>
            </Grid>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

export default SplitGrid;