/* eslint-disable no-underscore-dangle */
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
import { CircularProgress, Grid } from '@mui/material';
import axios from 'axios';
import { useData, URLPREFIX } from '../util/api';
import { useAppSelector } from '../util/redux/hooks';
import { selectUser } from '../util/redux/userSlice';
import { StudentCardFromID } from '../Admin/StudentCard';
import PageHeader from '../components/PageHeader';
import TeacherPhoneticsTable from './TeacherPhoneticsTable';
import LessonLevels from '../components/LessonLevels';
import { getLessonStringFromLessonLevel } from '../util/lessonLevels';

const ScrollableBox = styled(Box)({
  overflowY: 'auto',
  maxHeight: '100%',
});

// eslint-disable-next-line
function createData(data: any) {
  return data.map((student: any) => (
    <StudentCardFromID
      studentID={student.userId}
      name={`${student.firstName} ${student.lastName}`}
      lesson={`${getLessonStringFromLessonLevel(student.lessonNumber)} ${
        student.lessonName
      }`}
    />
  ));
}
function StudentName(props: any) {
  const { name } = props;
  return (
    <Typography color="text-primary" sx={{ fontSize: 20, color: 'black' }}>
      {name}
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
              return (
                <StudentName
                  name={`${student.firstName} ${student.lastName}`}
                />
              );
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

  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState<any[]>([]);
  const [levels, setLevels] = useState<any>([]);
  const [academicFlags, setAcademicFlags] = useState<any[]>([]);
  const [attendanceFlags, setAttendanceFlags] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(
        `${URLPREFIX}/student/students-lessons-by-teacher/${self.email}`,
      );

      setStudentData(data);

      const l: { [key: number]: number } = {};
      data.forEach((student: any) => {
        if (student.lessonNumber in l) {
          l[student.lessonNumber] += 1;
        } else {
          l[student.lessonNumber] = 1;
        }
      });
      setLevels(l);

      setAcademicFlags(data.filter((student: any) => student.progressFlag));

      setAttendanceFlags(data.filter((student: any) => student.attendanceFlag));

      setLoading(false);
    };
    fetchData();
  }, [self.email]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

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
                <LessonLevels levels={levels} />
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
