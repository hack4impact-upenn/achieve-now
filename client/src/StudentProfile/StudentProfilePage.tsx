import React from 'react';
import { Typography, Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

const student = {
  name: 'Anna Bay',
  school: 'Castro Valley Elementary School',
  teacher: 'Mrs. Johnson',
  phoneNumber: '510-888-3333',
  email: 'email@gmail.com',
  guardianName: 'Marina Bay',
  guardianCommunicationDays: 'Weekdays',
  guardianCommunicationTimes: 'Mornings',
  waiver: true,
};

function StudentProfilePage() {
  return (
    <Container
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          py: 2,
          px: 1,
          my: 6,
          height: '100%',
          backgroundColor: '#EEEEEE',
        }}
      >
        <Container>
          <Typography variant="h4" textAlign="center">
            {student.name}
          </Typography>
        </Container>
        <Container sx={{ my: 5 }}>
          <Box marginBottom={1}>
            <Typography variant="body1">
              <strong>School:</strong> {student.school}
            </Typography>
          </Box>
          <Box marginBottom={1}>
            <Typography variant="body1">
              <strong>Teacher:</strong> {student.teacher}
            </Typography>
          </Box>
          <Box marginBottom={1}>
            <Typography variant="body1">
              <strong>Phone Number:</strong> {student.phoneNumber}
            </Typography>
          </Box>
          <Box marginBottom={1}>
            <Typography variant="body1">
              <strong>Email:</strong> {student.email}
            </Typography>
          </Box>
          <Box marginBottom={1}>
            <Typography variant="body1">
              <strong>Parent/Guardian Name:</strong> {student.guardianName}
            </Typography>
          </Box>
          <Box marginBottom={1}>
            <Typography variant="body1">
              <strong>Parent Communication Preferences Days:</strong>{' '}
              {student.guardianCommunicationDays}
            </Typography>
          </Box>
          <Box marginBottom={1}>
            <Typography variant="body1">
              <strong>Parent Communication Preferences Times:</strong>{' '}
              {student.guardianCommunicationTimes}
            </Typography>
          </Box>
          <Box marginBottom={1}>
            <Typography variant="body1">
              <strong>Media Waiver:</strong>{' '}
              {student.waiver ? 'Complete' : 'Incomplete'}
            </Typography>
          </Box>
        </Container>
      </Box>
    </Container>
  );
}

export default StudentProfilePage;
