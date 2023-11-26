import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Box, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useParams, useNavigate } from 'react-router-dom';
import { PaginationTable, TColumn } from '../components/PaginationTable';
import Header from '../components/PageHeader';
import { useData, putData } from '../util/api';
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
  nextStep: string;
  lessonLevel: string;
}

function AdminBlockPage() {
  const params = useParams();
  const blockID = params.id;
  const navigate = useNavigate();

  const columns: TColumn[] = [
    { id: 'student', label: 'Student' },
    { id: 'coach', label: 'Coach' },
    { id: 'nextSteps', label: 'Next Steps' },
    { id: 'lessonNumber', label: 'Lesson Number' },
  ];

  // State for table data
  const [tableData, setTableData] = useState<BlockInfo>();
  const [studentData, setStudentData] = useState<StudentInfo[]>([]);

  // Fetch data from the backend
  const getStudentAndCoach = (studentID: string) => {
    axios
      .get(`http://localhost:4000/api/student/student/${studentID}`)
      .then((res) => {
        console.log(res.data.lesson_level);
        return axios.all([
          axios.get(
            `http://localhost:4000/api/lesson/${res.data.lesson_level}`,
          ),
          axios.get(`http://localhost:4000/api/coach/${res.data.coach_id[0]}`),
          axios.get(`http://localhost:4000/api/user/${res.data.user_id}`),
        ]);
      })
      .then(
        axios.spread((lesson, coachData, studentUser) => {
          return axios.all([
            lesson,
            axios.get(
              `http://localhost:4000/api/user/${coachData.data.user_id}`,
            ),
            studentUser,
          ]);
        }),
      )
      .then(
        axios.spread((lesson, coach, studentUser) => {
          const studentInfo: StudentInfo = {
            // eslint-disable-next-line no-underscore-dangle
            id: studentUser.data._id,
            name: `${studentUser.data.firstName} ${studentUser.data.lastName}`,
            coach: `${coach.data.firstName} ${coach.data.lastName}`,
            lessonLevel: lesson.data.number,
            nextStep: 'next step',
          };
          setStudentData((prevStudentData) => [
            ...prevStudentData,
            studentInfo,
          ]);
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
        });
      })
      .catch((error) => {
        console.error('Error fetching block info:', error);
      });
  }, [blockID]);

  // for the button
  const handleEditBlock = () => {
    // todo add functionality
    console.log('Editing block...');
  };

  const handleDeleteBlock = async () => {
    try {
      await putData(`block/delete-block`, { id: blockID });
      navigate('/admin-sessions');
    } catch (error) {
      console.log('error deleting');
    }
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
            flexDirection: 'column', // Changed from 'row' to 'column'
            alignItems: 'center',
            width: '80%',
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: theme.typography.fontWeightBold,
              marginBottom: theme.spacing(1), // Added margin bottom
            }}
          >
            {tableData?.day} {tableData?.startTime} - {tableData?.endTime}:{' '}
            {tableData?.name}
          </Typography>
          <Button
            variant="outlined"
            onClick={handleEditBlock}
            sx={{
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
          <Button
            variant="outlined"
            onClick={handleDeleteBlock}
            sx={{
              backgroundColor: 'white',
              borderColor: 'black',
              '&:hover': {
                backgroundColor: 'grey.200',
              },
              width: theme.spacing(20),
            }}
          >
            Delete Block
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
                  student: StudentInfo, // Explicitly type the data parameter
                ) =>
                  createAdminSessionsRow(
                    student.id,
                    student.name,
                    student.coach,
                    <a
                      href={`/admin-notes/${student.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Notes
                    </a>,
                    student.lessonLevel,
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
