import {
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import Header from '../components/PageHeader';

interface IAttendance {
  dates: string[];
  attendance: {
    name: string;
    attendance: {
      [date: string]: number;
    };
  }[];
}

const sampleData: IAttendance = {
  dates: ['10/06/2023', '10/03/2023', '10/01/2023', '09/29/2023', '09/27/2023'],
  attendance: [
    {
      name: 'Anna',
      attendance: {
        '10/06/2023': 1,
        '10/03/2023': 0,
        '10/01/2023': 1,
        '09/29/2023': 1,
        '09/27/2023': 1,
      },
    },
    {
      name: 'Helena',
      attendance: {
        '10/06/2023': 1,
        '10/03/2023': 1,
        '10/01/2023': 1,
        '09/29/2023': 1,
        '09/27/2023': 1,
      },
    },
    {
      name: 'Vince',
      attendance: {
        '10/06/2023': 0,
        '10/03/2023': 0,
        '10/01/2023': 0,
        '09/29/2023': 0,
        '09/27/2023': 0,
      },
    },
  ],
};

function StudentAttendancePage() {
  const [rawData, setRawData] = useState(sampleData);
  const [data, setData] = useState(sampleData);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value.toLowerCase();
    const newData = rawData.attendance.filter((student) =>
      student.name.toLowerCase().includes(search),
    );
    setData({ ...rawData, attendance: newData });
  };

  return (
    <>
      <Header />
      <Stack
        sx={{ width: '100%', height: '100vh', paddingTop: '1rem' }}
        alignItems="center"
        justifyContent="start"
        spacing={2}
      >
        <Typography variant="h3">Student Attendance</Typography>
        <Stack direction="row" spacing={2}>
          <TextField
            label="search"
            placeholder="Enter a Name..."
            variant="outlined"
            onChange={handleSearch}
          />
          <Stack direction="row" spacing={1}>
            <Button variant="outlined">Delete Date</Button>
            <Button variant="outlined">Add Date</Button>
          </Stack>
        </Stack>
        <Paper sx={{ margin: '4rem' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                {data.dates.map((date) => (
                  <TableCell>{date}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            {data.attendance.map((student) => (
              <TableRow>
                <TableCell>{student.name}</TableCell>
                {data.dates.map((date) => (
                  <TableCell>
                    {student.attendance[date] ? 'Present' : 'Absent'}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </Table>
        </Paper>
      </Stack>
    </>
  );
}

export default StudentAttendancePage;
