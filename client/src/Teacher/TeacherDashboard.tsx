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
import { Grid } from '@mui/material';
import { useData } from '../util/api';
import { useAppSelector } from '../util/redux/hooks';
import { selectUser } from '../util/redux/userSlice';
import { StudentCardFromID } from '../Admin/StudentCard';
import PageHeader from '../components/PageHeader';
import LessonLevels from '../components/LessonLevels';
import TeacherPhoneticsTable from './TeacherPhoneticsTable';

const ScrollableBox = styled(Box)({
  overflowY: 'auto',
  maxHeight: '100%',
});

// eslint-disable-next-line
function createData(data: any) {
  return data.map((student: any) => {
    /* eslint no-underscore-dangle: 0 */
    return <StudentCardFromID studentID={student._id} lesson="Lesson 1" />;
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
    <Card sx={{ marginBottom: '30px' }}>
      <CardContent sx={{ marginBottom: '30px' }}>
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
  const self = useAppSelector(selectUser);
  const students = useData(`student/students-by-teacher/${self.email}`);
  const studentData = students?.data ?? [];
  console.log('splitgrid', studentData);

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
              maxHeight: 'calc(100vh - 64px)', // Subtract the Toolbar height
              bgcolor: 'white',
              p: 2,
            }}
            elevation={0}
            square
          >
            <h2>Student</h2>
            {createData(studentData)}
          </Paper>

          <Paper
            sx={{
              width: '70%',
              overflowY: 'auto',
              maxHeight: 'calc(100vh - 64px)', // Subtract the Toolbar height
              bgcolor: '#EDEDED',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
            }}
            elevation={0}
            square
          >
            <Box sx={{ marginBottom: 2 }}>
              <h2>Class Progress</h2>
            </Box>

            <Box display="flex" flexDirection="row" width="100%">
              <Box width="50%" paddingRight={2}>
                <LessonLevels />
                <Box marginTop={2}>
                  <StudentConcernsCard
                    students={academicFlags}
                    title="Academic Concerns"
                    description="Students with a poor academic progress pattern"
                  />
                </Box>
                <Box marginTop={2}>
                  <StudentConcernsCard
                    students={attendanceFlags}
                    title="Attendance Concerns"
                    description="Students with a poor attendance pattern"
                  />
                </Box>
              </Box>

              <Box width="50%" paddingLeft={2}>
                <TeacherPhoneticsTable />
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

export default SplitGrid;
