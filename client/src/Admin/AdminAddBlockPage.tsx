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
import { ScreenshotMonitorRounded } from '@mui/icons-material';
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
import useAlert from '../util/hooks/useAlert';
import AlertType from '../util/types/alert';

interface submitState {
  day: string;
  name: string;
  startTime: string;
  endTime: string;
  zoom: string;
  absenceNotification: string;
  exitTicket: string;
  teacher: IUser | null;
  pairs: [IUser | null, IStudent | null][];
  coachesInBlock: string[];
  studentsInBlock: string[];
  blockNames: string[];
}

export function submitError({
  day,
  name,
  startTime,
  endTime,
  zoom,
  absenceNotification,
  exitTicket,
  teacher,
  pairs,
  coachesInBlock,
  studentsInBlock,
  blockNames,
}: submitState): string {
  if (
    day === '' ||
    name === '' ||
    startTime === '' ||
    endTime === '' ||
    zoom === '' ||
    absenceNotification === '' ||
    exitTicket === '' ||
    teacher === null
  ) {
    return 'Please fill out all fields';
  }
  if (endTime < startTime) {
    return 'Invalid times';
  }

  if (blockNames.includes(name)) {
    return 'Duplicate block name';
  }

  if (
    pairs.find(
      (pair: [IUser | null, IStudent | null]) =>
        pair[0] === null || pair[1] === null,
    )
  ) {
    return 'Please fill out all pairs';
  }

  const students = new Set<string>();
  const coaches = new Set<string>();
  pairs.forEach((pair: [IUser | null, IStudent | null]) => {
    if (pair[0]) {
      coaches.add(pair[0]._id);
    }
    if (pair[1]) {
      students.add(pair[1].user_id);
    }
  });
  if (students.size !== pairs.length) {
    return 'Duplicate students found in pairs';
  }
  if (coaches.size !== pairs.length) {
    return 'Duplicate coaches found in pairs';
  }

  if (studentsInBlock.find((studentId: string) => students.has(studentId))) {
    return 'Student is already in existing block';
  }

  if (coachesInBlock.find((coachId: string) => coaches.has(coachId))) {
    return 'Coach is already in existing block';
  }

  try {
    const _ = new URL(zoom);
  } catch (e) {
    return 'Invalid zoom link';
  }
  return '';
}

function AdminAddBlockPage() {
  const [day, setDay] = useState('');
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [zoom, setZoom] = useState('');
  const [absenceNotification, setAbsenceNotification] = useState('');
  const [exitTicket, setExitTicket] = useState('');
  const [teachers, setTeachers] = useState<IUser[]>([]);
  const [coaches, setCoaches] = useState([]);
  const [students, setStudents] = useState<IStudent[]>([]);
  const [allUsers, setAllUsers] = useState<IUser[]>([]);
  const [teacher, setTeacher] = useState<IUser | null>(null);

  const [pairs, setPairs] = useState<[IUser | null, IStudent | null][]>([
    [null, null],
  ]);

  const [error, setError] = useState('');

  const users = useData('admin/all');
  const studentList = useData('student/all');
  const blocks = useData('block/all');

  const [studentsInBlock, setStudentsInBlock] = useState<string[]>([]);
  const [coachesInBlock, setCoachesInBlock] = useState<string[]>([]);
  const [blockNames, setBlockNames] = useState<string[]>([]);

  const { setAlert } = useAlert();

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
    const blockData: IBlock[] = blocks?.data;
    if (blockData) {
      const currBlockNames: string[] = [];
      const blockStudentIds: string[] = [];
      const blockCoachIds: string[] = [];
      blockData.forEach((block: IBlock) => {
        currBlockNames.push(block.name);
        block.students.forEach((studentId: string) => {
          blockStudentIds.push(studentId);
          const foundStudent: IStudent | undefined = students.find(
            (currStudent: IStudent) => currStudent.user_id === studentId,
          );
          if (
            foundStudent &&
            foundStudent.coach_id &&
            foundStudent.coach_id.length > 0
          ) {
            blockCoachIds.push(foundStudent.coach_id[0]);
          }
        });
      });
      setBlockNames(currBlockNames);
      setStudentsInBlock(blockStudentIds);
      setCoachesInBlock(blockCoachIds);
    }
  }, [blocks, students]);

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
  const handleAbsenceNotiChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setAbsenceNotification(event.target.value as string);
  };
  const handleExitTicketChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setExitTicket(event.target.value as string);
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

  const reset = () => {
    setError('');
    setDay('');
    setName('');
    setStartTime('');
    setEndTime('');
    setTeacher(null);
    setPairs([[null, null]]);
    setZoom('');
    setAbsenceNotification('');
    setExitTicket('');
  };

  const handleSubmit = () => {
    const desc = submitError({
      day,
      name,
      startTime,
      endTime,
      zoom,
      absenceNotification,
      exitTicket,
      teacher,
      pairs,
      coachesInBlock,
      studentsInBlock,
      blockNames,
    });
    if (desc) {
      setError(desc);
      return;
    }

    addBlock({
      day,
      name,
      startTime,
      endTime,
      zoom,
      absenceNotification,
      exitTicket,
      pairs,
    });
    setAlert('Added block successfully!', AlertType.SUCCESS);
    reset();
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
            <Grid item width="1">
              <TextField
                fullWidth
                value={absenceNotification}
                onChange={handleAbsenceNotiChange}
                label="Absence Notification Link"
                variant="standard"
                placeholder="Absence notification link"
              />
            </Grid>
            <Grid item width="1">
              <TextField
                fullWidth
                value={exitTicket}
                onChange={handleExitTicketChange}
                label="Exit Ticket Link"
                variant="standard"
                placeholder="Exit Ticket link"
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
                <Typography
                  justifyContent="center"
                  color="red"
                  style={{ paddingBottom: '20px' }}
                >
                  {error}
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
