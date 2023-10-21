/* eslint-disable no-nested-ternary */
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
import dayjs from 'dayjs';
import AddDateDialog from './AddDateDialog';
import Header from '../components/PageHeader';
import DeleteDateDialog from './DeleteDateDialog';

interface IAttendance {
  dates: number[];
  attendance: {
    name: string;
    attendance: {
      [date: string]: string;
    };
  }[];
}

function StudentAttendancePage() {
  const [rawData, setRawData] = useState<IAttendance>({
    dates: [] as number[],
    attendance: [],
  });
  const [data, setData] = useState<IAttendance>({
    dates: [] as number[],
    attendance: [],
  });
  const [dateDialogOpen, setDateDialogOpen] = useState<boolean>(false);
  const [deleteDateDialogOpen, setDeleteDateDialogOpen] =
    useState<boolean>(false);

  const fetchData = async () => {
    const result = await axios.get('http://localhost:4000/api/student/all');
    const students = result.data as any[];
    await Promise.all(
      students.map(async (student: any, index: number) => {
        const res = await axios.get(
          `http://localhost:4000/api/user/${student.user_id}`,
        );
        students[index] = {
          ...student,
          name: `${res.data.firstName} ${res.data.lastName}`,
        };
      }),
    );
    const attendances = students.map((student: any) => ({
      name: student.name,
      attendance: student.progress_stats.attendance ?? {},
    }));
    const dates: number[] = [];
    attendances.forEach((student: any) => {
      Object.keys(student.attendance).forEach((date) => {
        if (!dates.includes(Number(date))) dates.push(Number(date));
      });
    });
    console.log(dates);
    setRawData({ dates, attendance: attendances });
    setData({ dates, attendance: attendances });
    console.log({ dates, attendance: attendances });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value.toLowerCase();
    const newData = rawData.attendance.filter((student) =>
      student.name.toLowerCase().includes(search),
    );
    setData({ ...rawData, attendance: newData });
  };

  const addDate = async (date: number) => {
    await axios.put('http://localhost:4000/api/student/attendance/create', {
      date,
    });
    fetchData();
  };

  const deleteDate = async (date: number) => {
    await axios.put('http://localhost:4000/api/student/attendance/delete', {
      date,
    });
    fetchData();
  };

  return (
    <>
      <AddDateDialog
        open={dateDialogOpen}
        setOpen={() => setDateDialogOpen(false)}
        addDate={addDate}
      />
      <DeleteDateDialog
        open={deleteDateDialogOpen}
        setOpen={() => setDeleteDateDialogOpen(false)}
        options={data.dates}
        deleteDate={deleteDate}
      />
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
            <Button
              variant="outlined"
              onClick={() => setDeleteDateDialogOpen(true)}
            >
              Delete Date
            </Button>
            <Button variant="outlined" onClick={() => setDateDialogOpen(true)}>
              Add Date
            </Button>
          </Stack>
        </Stack>
        <Paper sx={{ margin: '4rem' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                {data.dates.map((date) => (
                  <TableCell>{dayjs.unix(date).format('MM/DD/YYYY')}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            {data.attendance.map((student) => (
              <TableRow>
                <TableCell>{student.name}</TableCell>
                {data.dates.map((date) => (
                  <TableCell>{student.attendance[date]}</TableCell>
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
