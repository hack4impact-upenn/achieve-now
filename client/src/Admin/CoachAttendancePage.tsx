/* eslint-disable no-nested-ternary */
import {
  Box,
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Table,
  TableCell,
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

const coachStatusOptions = [
  'Planned Absence',
  'Late',
  'LMC',
  'No Show',
  'No Show - Covered',
  'Dismissed',
  'Tech Issue',
  'Covered For',
  'Co-Coach Attended',
  'No Session',
];

interface IAttendance {
  dates: number[];
  attendance: {
    id: string;
    name: string;
    blocks: string[];
    attendance: {
      [date: string]: string;
    };
  }[];
}

function CoachAttendancePage() {
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
  const [filterBlock, setFilterBlock] = useState<string>('All Blocks');

  const [dateDialogOpen, setDateDialogOpen] = useState<boolean>(false);
  const [deleteDateDialogOpen, setDeleteDateDialogOpen] =
    useState<boolean>(false);

  const fetchData = async () => {
    const result = await axios.get('http://localhost:4000/api/coach/all');
    const coaches = result.data as any[];
    const blockList: string[] = [];
    await Promise.all(
      coaches.map(async (coach: any, index: number) => {
        let res = await axios.get(
          `http://localhost:4000/api/user/${coach.user_id}`,
        );
        coaches[index] = {
          ...coach,
          name: `${res.data.firstName} ${res.data.lastName}`,
        };
        res = await axios.get(
          `http://localhost:4000/api/coach/blocks/${coach.user_id}`,
        );
        coaches[index] = {
          ...coach,
          blocks: res.data,
        };
        res.data.forEach((block: string) => {
          if (!blockList.includes(block)) {
            blockList.push(block);
          }
        });
      }),
    );
    const attendances = coaches.map((coach: any) => ({
      // eslint-disable-next-line no-underscore-dangle
      id: coach._id,
      name: coach.name,
      blocks: coach.blocks,
      attendance: coach.progress_stats.attendance ?? {},
    }));
    const dates: number[] = [];
    attendances.forEach((coach: any) => {
      Object.keys(coach.attendance).forEach((date) => {
        if (!dates.includes(Number(date))) dates.push(Number(date));
      });
    });
    setRawData({ dates, attendance: attendances });
    setData({ dates, attendance: attendances });
    setBlocks(blockList);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchFilter = e.target.value.toLowerCase();
    const newData = rawData.attendance.filter(
      (coach) =>
        coach.name.toLowerCase().includes(searchFilter) &&
        (filterBlock === 'All Blocks' || coach.blocks.includes(filterBlock)),
    );
    setData({ ...rawData, attendance: newData });
    setSearch(searchFilter);
  };

  const handleFilterBlock = (e: SelectChangeEvent<string>) => {
    const newData = rawData.attendance.filter(
      (coach) =>
        coach.name.toLowerCase().includes(search) &&
        (e.target.value === 'All Blocks' ||
          coach.blocks.includes(e.target.value)),
    );
    setData({ ...rawData, attendance: newData });
    setFilterBlock(e.target.value);
  };

  const addDate = async (date: number) => {
    await axios.put('http://localhost:4000/api/coach/attendance/create', {
      date,
    });
    fetchData();
  };

  const deleteDate = async (date: number) => {
    await axios.put('http://localhost:4000/api/coach/attendance/delete', {
      date,
    });
    fetchData();
  };

  const handleChangeAttendance = async (
    id: string,
    date: number,
    attendance: string,
  ) => {
    await axios.put('http://localhost:4000/api/coach/attendance', {
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
        <Typography variant="h3">Coach Attendance</Typography>
        <Stack direction="row" spacing={2}>
          <TextField
            label="search"
            placeholder="Enter a Name..."
            variant="outlined"
            onChange={handleSearch}
          />
          {blocks.length > 0 && (
            <Select value={filterBlock} onChange={handleFilterBlock}>
              <MenuItem value="All Blocks">All Blocks</MenuItem>
              {blocks.map((block: string) => (
                <MenuItem value={block}>{block}</MenuItem>
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
              <TableCell>Coach</TableCell>
              {data.dates.map((date) => (
                <TableCell>{dayjs.unix(date).format('MM/DD/YYYY')}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          {data.attendance.map((coach) => (
            <TableRow>
              <TableCell>{coach.name}</TableCell>
              {data.dates.map((date) => (
                <TableCell>
                  <Select
                    value={coach.attendance[date]}
                    onChange={(e) =>
                      handleChangeAttendance(coach.id, date, e.target.value)
                    }
                  >
                    {coachStatusOptions.map((option) => (
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

export default CoachAttendancePage;
