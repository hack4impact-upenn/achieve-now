import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Box, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useParams } from 'react-router-dom';
import { PaginationTable, TColumn } from '../components/PaginationTable';
import Header from '../components/PageHeader';
import { useData } from '../util/api';
import theme from '../assets/theme';
import ScreenGrid from '../components/ScreenGrid';

interface AdminDashboardRow {
  key: string;
  student: string;
  coach: string;
  nextSteps: React.ReactElement;
  lessonNumber: string;
}

interface BlockInfo {
  key: string;
  students: [string];
  day: string;
  startTime: string;
  endTime: string;
  name: string;
  zoom: string;
  // Add other properties if needed
}

interface StudentInfo {
  id: string;
  name: string;
  coach: string;
  lessonLevel: string;
}

function AdminBlockPage() {
  const params = useParams();
  const blockID = params.id;

  const columns: TColumn[] = [
    { id: 'student', label: 'Student' },
    { id: 'coach', label: 'Coach' },
    { id: 'nextSteps', label: 'Next Steps' },
    { id: 'lessonNumber', label: 'Lesson Number' },
  ];

  // State for table data
  const [tableData, setTableData] = useState<BlockInfo[] | null>(null);
  const [studentData, setStudentData] = useState<StudentInfo[]>([]);

  // Fetch data from the backend
  const getStudentAndCoach = (studentID: string) => {
    let studentUserId = '';
    axios
      .get(`http://localhost:4000/api/student/student/${studentID}`)
      .then((res) => {
        studentUserId = res.data.user_id;
        return axios.get(
          `http://localhost:4000/api/coach/${res.data.coach_id}`,
        );
      })
      .then((coachData) => {
        return axios.all([
          axios.get(`http://localhost:4000/api/user/${user}`),
          axios.get(`http://localhost:4000/api/user/${coachData.data.user_id}`),
        ]);
      })
      .then(
        axios.spread((student, coach) => {
          console.log(student);
          console.log(coach);
        }),
      );
  };

  useEffect(() => {
    // assumming the block id is known / fetched from elsewhere
    axios
      .get(`http://localhost:4000/api/block/block-info-id/${blockID}`)
      .then((response) => {
        setTableData(response.data);
        response.data.students.forEach((student: string) => {
          getStudentAndCoach(student);
          // axios
          //   .get(`http://localhost:4000/api/student/student/${student}`)
          //   .then((res) => {
          //     const copy = studentData;
          //     copy?.push(res.data);
          //     console.log(res.data);
          //     setStudentData(copy);
          //   });
        });
      })
      .catch((error) => {
        console.error('Error fetching block info:', error);
      });
  }, [blockID, studentData]);

  // for the button
  const handleEditBlock = () => {
    // todo add functionality
    console.log('Editing block...');
  };

  // Used to create the data type to create a row in the table
  function createAdminSessionsRow(
    _id: string,
    student: string,
    coach: string,
    nextSteps: React.ReactElement,
    lessonNumber: string,
  ): AdminDashboardRow {
    return {
      key: _id,
      student,
      coach,
      nextSteps,
      lessonNumber,
    };
  }

  return (
    <div>
      <Header />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: theme.spacing(10),
          marginTop: theme.spacing(6),
          marginLeft: theme.spacing(6),
          marginRight: theme.spacing(6),
          minHeight: '80vh',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '80%',
            position: 'relative',
            paddingBottom: theme.spacing(1),
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: theme.typography.fontWeightBold,
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            Monday 8:50 - 9:50: Block 1
          </Typography>
          <Button
            variant="outlined"
            onClick={handleEditBlock}
            sx={{
              position: 'absolute',
              right: '0%',
              backgroundColor: 'white',
              borderColor: 'black',
              '&:hover': {
                backgroundColor: 'grey.200',
              },
              width: theme.spacing(20),
            }}
          >
            Edit Block
          </Button>
        </Box>

        <Box
          sx={{
            marginTop: theme.spacing(5),
            width: '80%',
            padding: theme.spacing(2),
          }}
        >
          {tableData && (
            <PaginationTable
              rows={studentData.map(
                (
                  student: any, // Explicitly type the data parameter
                ) =>
                  createAdminSessionsRow(
                    student.key,
                    student.student,
                    student.coach,
                    <a // noteLink
                      href="../users"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Notes
                    </a>,
                    student.lesson,
                  ),
              )}
              columns={columns}
            />
          )}
        </Box>
      </Box>
    </div>
  );
}

export default AdminBlockPage;
