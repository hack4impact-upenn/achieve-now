import React, { useEffect, useState } from 'react';
import { Typography, Box, Container } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useData } from '../util/api';
import IStudent from '../util/types/student';
import Header from '../components/PageHeader';

function StudentProfilePage() {
  const { id } = useParams();
  // const [studentInfo, setStudentInfo] = useState<IStudent>(Object);

  const student = useData(`student/${id}`);
  const studentInfo = student ? student.data : null;

  if (studentInfo === null) {
    return <div>Student not available</div>;
  }
  return (
    <>
      <Header />
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            py: 2,
            pl: 0.5,
            my: 8,
            height: 700,
            width: 550,
            backgroundColor: '#EEEEEE',
          }}
        >
          <Container>
            <Typography variant="h4" textAlign="center">
              {studentInfo.name}
            </Typography>
          </Container>
          <Container sx={{ my: 5 }}>
            <Box marginBottom={1}>
              <Typography variant="body1">
                <strong>School:</strong> {studentInfo.school_name}
              </Typography>
            </Box>
            <Box marginBottom={1}>
              <Typography variant="body1">
                <strong>Teacher:</strong> {studentInfo.teacher_name}
              </Typography>
            </Box>
            <Box marginBottom={1}>
              <Typography variant="body1">
                <strong>Phone Number:</strong> {studentInfo.phoneNumber}
              </Typography>
            </Box>
            <Box marginBottom={1}>
              <Typography variant="body1">
                <strong>Email:</strong> {studentInfo.email}
              </Typography>
            </Box>
            <Box marginBottom={1}>
              <Typography variant="body1">
                <strong>Parent/Guardian Name:</strong> {studentInfo.parent_name}
              </Typography>
            </Box>
            <Box marginBottom={1}>
              <Typography variant="body1">
                <strong>Parent Communication Preferences Days:</strong>{' '}
                {studentInfo.parent_commmunication_days}
              </Typography>
            </Box>
            <Box marginBottom={1}>
              <Typography variant="body1">
                <strong>Parent Communication Preferences Times:</strong>{' '}
                {studentInfo.parent_communication_times}
              </Typography>
            </Box>
            <Box marginBottom={1}>
              <Typography variant="body1">
                <strong>Media Waiver:</strong>{' '}
                {studentInfo.media_waiver ? 'Complete' : 'Incomplete'}
              </Typography>
            </Box>
          </Container>
        </Box>
      </Container>
    </>
  );
}

export default StudentProfilePage;
