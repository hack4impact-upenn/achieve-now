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
import React, { useEffect, useState } from 'react';
import axios from 'axios';
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

function StudentAttendancePage() {
  const [rawData, setRawData] = useState<IAttendance>({
    dates: [] as string[],
    attendance: [],
  });
  const [data, setData] = useState<IAttendance>({
    dates: [] as string[],
    attendance: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('http://localhost:4000/api/student/all');
      const attendances = result.data.map((student: any) => ({
        name: 'Test Name',
        attendance: student.progress_stats.attendance ?? {},
      }));
      const dates: string[] = [];
      attendances.forEach((student: any) => {
        Object.keys(student.attendance).forEach((date) => {
          if (!dates.includes(date)) dates.push(date);
        });
      });
      setRawData({ dates, attendance: attendances });
      setData({ dates, attendance: attendances });
    };

    fetchData();
  });

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
