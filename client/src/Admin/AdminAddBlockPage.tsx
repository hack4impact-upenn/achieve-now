import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography,
  Grid,
  TextField,
  MenuItem,
  Select,
  SelectChangeEvent,
  Button,
  Autocomplete,
} from '@mui/material';
import { display } from '@mui/system';
import { RemoveCircleOutlineRounded } from '@material-ui/icons';
import { PaginationTable, TColumn } from '../components/PaginationTable';
import Header from '../components/PageHeader';
import theme from '../assets/theme';
import FormGrid from '../components/form/FormGrid';
import FormCol from '../components/form/FormCol';
import PrimaryButton from '../components/buttons/PrimaryButton';
import { getData, putData, useData } from '../util/api';
import IUser from '../util/types/user';
import IStudent from '../util/types/student';
import { addBlock } from '../Home/api';
import IBlock from '../util/types/block';
import ICoach from '../util/types/coach';
import { ScreenshotMonitorRounded } from '@mui/icons-material';

interface ResolvedReq {
  data: any | null;
  error: Error | any | null;
}

interface submitState {
  day: string;
  name: string;
  startTime: string;
  endTime: string;
  zoom: string;
  teacher: IUser | null;
  pairs: [IUser | null, IStudent | null][];
}

export function submitError({
  day,
  name,
  startTime,
  endTime,
  zoom,
  teacher,
  pairs,
}: submitState): boolean {
  if (
    day === '' ||
    name === '' ||
    startTime === '' ||
    endTime === '' ||
    zoom === '' ||
    teacher === null ||
    pairs.length === 0 ||
    pairs[0][0] === null ||
    pairs[0][1] === null
  ) {
    return true;
  }
  try {
    const _ = new URL(zoom);
  } catch (e) {
    return true;
  }
  return false;
}

function AdminAddBlockPage() {
  const [day, setDay] = useState('');
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [zoom, setZoom] = useState('');
  const [teachers, setTeachers] = useState<IUser[]>([]);
  const [coaches, setCoaches] = useState([]);
  const [students, setStudents] = useState([]);
  const [allUsers, setAllUsers] = useState<IUser[]>([]);
  const [teacher, setTeacher] = useState<IUser | null>(null);

  const [pairs, setPairs] = useState<[IUser | null, IStudent | null][]>([
    [null, null],
  ]);

  const [error, setError] = useState(false);

  const users = useData('admin/all');
  const studentList = useData('student/all');
  const blocks = useData('block/all');

  const [studentsInBlock, setStudentsInBlock] = useState<string[]>([]);
  const [coachesInBlock, setCoachesInBlock] = useState<string[]>([]);
  const [blockNames, setBlockNames] = useState<string[]>([]);

  useEffect(() => {
    const data = users?.data || [];
    setTeachers(data.filter((user: IUser) => user.role === 'teacher'));
    setCoaches(data.filter((user: IUser) => user.role === 'coach'));
    setAllUsers(data);
  }, [users]);

  useEffect(() => {
    setStudents(studentList?.data || []);
  }, [studentList]);

  useEffect(() => {
    const blockData: IBlock[] = studentList?.data;
    if (blockData) {
      var blockNames: string[] = [];
      var studentPromises: Promise<ResolvedReq>[] = [];
      var blockStudentIds: string[] = [];
      blockData.forEach((block: IBlock) => {
        blockNames.push(block.name);
        block.students.forEach((student_id: string) => {
          blockStudentIds.push(student_id);
          studentPromises.push(
            getData(`student/${student_id}`),
          );
        });
      });
      var blockCoachIds: string[] = [];
      Promise.all(studentPromises).then((students: ResolvedReq[]) => {
        students.forEach((res: ResolvedReq) => {
          if (res.data?.coach_id) {
            blockCoachIds.push(res.data?.coach_id);
          };
        });
      }).finally(() => setCoachesInBlock(blockCoachIds as string[]));
      setBlockNames(blockNames);
      setStudentsInBlock(blockStudentIds);
    }
  }, [blocks]);

  const handleDayChange = (event: SelectChangeEvent) => {
    setDay(event.target.value as string);
  };

  const handleNameChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setName(event.target.value as string);
  };

  const handleStartTimeChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setStartTime(event.target.value as string);
  };

  const handleEndTimeChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setEndTime(event.target.value as string);
  };

  const handleZoomChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setZoom(event.target.value as string);
  };

  const displayName = (user: IUser | null) => {
    if (user === null) {
      return '';
    }
    return `${user.firstName} ${user.lastName}`;
  };

  const getStudentName = (stud: IStudent) => {
    return displayName(
      allUsers.find((user: IUser) => user._id === stud.user_id) || null,
    );
  };

  const handleDeleteRow = (index: number) => {
    if (pairs.length === 1) {
      setPairs([[null, null]]);
      return;
    }
    setPairs((prev) => [...prev.slice(0, index), ...prev.slice(index + 1)]);
  };

  const handleSubmit = () => {
    if (submitError({ day, name, startTime, endTime, zoom, teacher, pairs })) {
      setError(true);
      return;
    }
    addBlock({
      day,
      name,
      startTime,
      endTime,
      zoom,
      pairs,
    });
    window.location.reload();
  };

  return (
    <div>
      <Header />
      <Grid
        container
        xs={12}
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        sx={{ paddingTop: '5rem' }}
      >
        <FormGrid>
          <Typography variant="h4" sx={{ textAlign: 'center' }}>
            Add Block
          </Typography>
          <FormCol>
            <Grid item width="1">
              <Typography variant="subtitle1">Day</Typography>
              <Select
                value={day}
                label="Day"
                fullWidth
                onChange={handleDayChange}
              >
                <MenuItem value="Sunday">Sunday</MenuItem>
                <MenuItem value="Monday">Monday</MenuItem>
                <MenuItem value="Tuesday">Tuesday</MenuItem>
                <MenuItem value="Wednesday">Wednesday</MenuItem>
                <MenuItem value="Thursday">Thursday</MenuItem>
                <MenuItem value="Friday">Friday</MenuItem>
                <MenuItem value="Saturday">Saturday</MenuItem>
              </Select>
            </Grid>
            <Grid item width="1">
              <TextField
                fullWidth
                value={name}
                onChange={handleNameChange}
                label="Name"
                variant="standard"
                placeholder="Name"
              />
            </Grid>
            <Grid item width="1">
              <Typography variant="subtitle1">Start Time</Typography>
              <TextField
                fullWidth
                value={startTime}
                onChange={handleStartTimeChange}
                type="time"
                variant="standard"
              />
            </Grid>
            <Grid item width="1">
              <Typography variant="subtitle1">End Time</Typography>
              <TextField
                fullWidth
                value={endTime}
                onChange={handleEndTimeChange}
                type="time"
                variant="standard"
              />
            </Grid>
            <Grid item width="1">
              <TextField
                fullWidth
                value={zoom}
                onChange={handleZoomChange}
                label="Zoom link"
                variant="standard"
                placeholder="Zoom link"
              />
            </Grid>
            <Grid item width="1" marginBottom="1">
              <Autocomplete
                disablePortal
                id="teacher-dropdown"
                onChange={(event: any, newValue: string | null) => {
                  setTeacher(
                    teachers.find(
                      (person: IUser) =>
                        displayName(person) === (newValue || ''),
                    ) || null,
                  );
                }}
                value={teacher && displayName(teacher)}
                options={teachers.map((user: IUser) => displayName(user))}
                renderInput={(params) => (
                  /* eslint-disable react/jsx-props-no-spreading */
                  <TextField {...params} label="Teacher" />
                )}
              />
            </Grid>
            {teacher && (
              <Grid item width="1">
                <Typography variant="h6">Pairs</Typography>
                {pairs.map((pair, index) => (
                  <Grid
                    display="flex"
                    flexDirection="row"
                    gap={theme.spacing(2)}
                    sx={{
                      marginTop: '10px',
                    }}
                  >
                    <Autocomplete
                      disablePortal
                      sx={{ width: '45%' }}
                      id={`coach-dropdown-${index}`}
                      options={coaches.map((coach: IUser) =>
                        displayName(coach),
                      )}
                      /* eslint no-underscore-dangle: 0 */
                      value={pair[0] && displayName(pair[0])}
                      renderInput={(params) => (
                        /* eslint-disable react/jsx-props-no-spreading */
                        <TextField {...params} label="Coach" />
                      )}
                      onChange={(event: any, newValue: string | null) => {
                        const curr: IUser | null =
                          coaches.find(
                            (coach: IUser) => displayName(coach) === newValue,
                          ) || null;
                        setPairs((prev) => [
                          ...prev.slice(0, index),
                          [curr, prev[index][1]],
                          ...prev.slice(index + 1),
                        ]);
                      }}
                    />
                    <Autocomplete
                      disablePortal
                      sx={{ width: '45%' }}
                      id={`student-dropdown-${index}`}
                      options={students
                        .filter(
                          /* eslint no-underscore-dangle: 0 */
                          (student: IStudent) => {
                            return (student.teacher_id || []).includes(
                              teacher._id,
                            );
                          },
                        )
                        .map((student: IStudent) => getStudentName(student))}
                      value={pair[1] && getStudentName(pair[1])}
                      renderInput={(params) => (
                        /* eslint-disable react/jsx-props-no-spreading */
                        <TextField {...params} label="Student" />
                      )}
                      onChange={(event: any, newValue: string | null) => {
                        const curr: IStudent | null =
                          students.find(
                            (student: IStudent) =>
                              getStudentName(student) === newValue,
                          ) || null;
                        setPairs((prev) => [
                          ...prev.slice(0, index),
                          [prev[index][0], curr],
                          ...prev.slice(index + 1),
                        ]);
                      }}
                    />
                    <Button
                      variant="outlined"
                      id={`coach-dropdown-${index}`}
                      onClick={() => handleDeleteRow(index)}
                      sx={{
                        backgroundColor: 'white',
                        borderColor: 'black',
                        '&:hover': {
                          backgroundColor: 'grey.200',
                        },
                        width: theme.spacing(20),
                      }}
                    >
                      Delete Entry
                    </Button>
                  </Grid>
                ))}
                <Button
                  variant="outlined"
                  onClick={() => setPairs((prev) => [...prev, [null, null]])}
                  sx={{
                    marginTop: '10px',
                    right: '0%',
                    backgroundColor: 'white',
                    borderColor: 'black',
                    '&:hover': {
                      backgroundColor: 'grey.200',
                    },
                    width: theme.spacing(20),
                  }}
                >
                  Add Entry
                </Button>
              </Grid>
            )}
            <Grid item container justifyContent="center">
              <PrimaryButton
                type="submit"
                variant="contained"
                onClick={handleSubmit}
              >
                Submit
              </PrimaryButton>
            </Grid>
            {error && (
              <Grid item container justifyContent="center">
                <Typography justifyContent="center" color="red">
                  Please fill out all fields.
                </Typography>
              </Grid>
            )}
          </FormCol>
        </FormGrid>
      </Grid>
    </div>
  );
}

export default AdminAddBlockPage;
