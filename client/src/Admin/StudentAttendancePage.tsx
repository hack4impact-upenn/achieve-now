/* eslint-disable no-nested-ternary */
import {
  Box,
  Button,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
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
import AddDateDialog from './AddDateAttendanceDialog';
import Header from '../components/PageHeader';
import DeleteDateDialog from './DeleteDateAttendanceDialog';

const studentStatusOptions = [
  'No Session',
  'Not in School',
  'Early Dismissal',
  'Special Event',
  'Absent',
  'Late',
  'Not in Session-Other Appt',
  'At Home',
  'Tech Issue',
  'Behavior Issue',
  'Walked Away',
  'Logged Off',
  "Didn't Finish",
  'Assessed Ahead',
  'Dropped - Attendance',
  'Moved',
  'Review',
  'Review Complete',
  'Finished Program',
  'Needs SR',
  'Passed SR',
  'Failed SR',
  'Needs CC',
  'Passed CC',
  'Failed CC',
];

interface IAttendance {
  dates: number[];
  attendance: {
    id: string;
    name: string;
    blockName: string;
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
  const [blocks, setBlocks] = useState<string[]>([]);
  const [search, setSearch] = useState<string>('');
  const [block, setBlock] = useState<string>('All Blocks');

  const [dateDialogOpen, setDateDialogOpen] = useState<boolean>(false);
  const [deleteDateDialogOpen, setDeleteDateDialogOpen] =
    useState<boolean>(false);

  const fetchData = async () => {
    const result = await axios.get('http://localhost:4000/api/student/all');
    const students = result.data as any[];
    const studentBlocks: string[] = [];
    await Promise.all(
      students.map(async (student: any, index: number) => {
        let res = await axios.get(
          `http://localhost:4000/api/user/${student.user_id}`,
        );
        students[index] = {
          ...student,
          name: `${res.data.firstName} ${res.data.lastName}`,
        };
        if (res.data.block_id) {
          res = await axios.get(
            `http://localhost:4000/api/block/block-info-id/${res.data.block_id}`,
          );
          if (!studentBlocks.includes(res.data.name)) {
            studentBlocks.push(res.data.name);
          }
          students[index] = {
            ...students[index],
            blockName: res.data.name,
          };
        }
      }),
    );

    const attendances = students.map((student: any) => ({
      // eslint-disable-next-line no-underscore-dangle
      id: student._id,
      name: student.name,
      blockName: student.blockName,
      attendance: student.progress_stats.attendance ?? {},
    }));
    const dates: number[] = [];
    attendances.forEach((student: any) => {
      Object.keys(student.attendance).forEach((date) => {
        if (!dates.includes(Number(date))) dates.push(Number(date));
      });
    });

    console.log(attendances);

    setRawData({ dates, attendance: attendances });
    setData({ dates, attendance: attendances });
    setBlocks(studentBlocks);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchFilter = e.target.value.toLowerCase();
    const newData = rawData.attendance.filter(
      (student) =>
        student.name.toLowerCase().includes(search) &&
        (block === 'All Blocks' || student.blockName === block),
    );
    setSearch(searchFilter);
    setData({ ...rawData, attendance: newData });
  };

  const handleFilterBlock = (e: SelectChangeEvent<string>) => {
    const filter = e.target.value;
    const newData = rawData.attendance.filter(
      (student) =>
        (student.blockName === filter || filter === 'All Blocks') &&
        student.name.toLowerCase().includes(search),
    );
    setBlock(filter);
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

  const handleChangeAttendance = async (
    id: string,
    date: number,
    attendance: string,
  ) => {
    await axios.put('http://localhost:4000/api/student/attendance', {
      id,
      date,
      attendance,
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
        sx={{ width: '100%', paddingTop: '1rem' }}
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
          {blocks.length > 0 && (
            <Select onChange={handleFilterBlock} value={block}>
              <MenuItem value="All Blocks">All Blocks</MenuItem>
              {blocks.map((b) => (
                <MenuItem value={b}>{b}</MenuItem>
              ))}
            </Select>
          )}
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
      </Stack>
      <Box
        sx={{
          padding: '2rem',
          flexDirection: 'row',
          justifyContent: 'start',
        }}
      >
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
                <TableCell>
                  <Select
                    value={student.attendance[date]}
                    onChange={(e) =>
                      handleChangeAttendance(student.id, date, e.target.value)
                    }
                  >
                    {studentStatusOptions.map((option) => (
                      <MenuItem value={option}>{option}</MenuItem>
                    ))}
                  </Select>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </Table>
      </Box>
    </>
  );
}

export default StudentAttendancePage;
