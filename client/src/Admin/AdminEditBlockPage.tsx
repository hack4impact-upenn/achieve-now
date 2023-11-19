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
import { Box, display } from '@mui/system';
import { RemoveCircleOutlineRounded } from '@material-ui/icons';
import { useParams } from 'react-router-dom';
import { PaginationTable, TColumn } from '../components/PaginationTable';
import Header from '../components/PageHeader';
import theme from '../assets/theme';
import FormGrid from '../components/form/FormGrid';
import FormCol from '../components/form/FormCol';
import PrimaryButton from '../components/buttons/PrimaryButton';
import { getData, useData } from '../util/api';
import IUser from '../util/types/user';
import IStudent from '../util/types/student';
import { editBlock } from '../Home/api';

function AdminEditBlockPage() {
  const blockId = useParams().id;
  const block = useData(`block/block-info-id/${blockId}`);

  const [valid, setValid] = useState(false);

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
  const [nameError, setNameError] = useState('');

  const users = useData('admin/all');
  const studentList = useData('student/all');

  useEffect(() => {
    if (!block || !block.data) {
      setValid(false);
      return;
    }
    setValid(true);
    const data = block?.data || {};
    setDay(data.day);
    setName(data.name);
    setStartTime(data.startTime);
    setEndTime(data.endTime);
    setZoom(data.zoom);

    if (data.students && data.students.length > 0) {
      const resolvedStudents = data.students.map((studentId: string) => {
        return (
          students.find((user: IStudent) => user.user_id === studentId) || null
        );
      });
      if (
        resolvedStudents.length > 0 &&
        resolvedStudents[0]?.teacher_id &&
        resolvedStudents[0]?.teacher_id.length > 0
      ) {
        setTeacher(
          teachers.find(
            (user: IUser) => resolvedStudents[0].teacher_id[0] === user._id,
          ) || null,
        );
      }

      const p: [IUser | null, IStudent | null][] = [];
      resolvedStudents.forEach((s: IStudent) => {
        if (s === null) {
          return;
        }
        p.push([
          coaches.find((user: IUser) => s.coach_id[0] === user._id) || null,
          s,
        ]);
      });
      setPairs(p);
    }
  }, [block, students, teachers, coaches]);

  useEffect(() => {
    const data = users?.data || [];
    setTeachers(data.filter((user: IUser) => user.role === 'teacher'));
    setCoaches(data.filter((user: IUser) => user.role === 'coach'));
    setAllUsers(data);
  }, [users]);

  useEffect(() => {
    setStudents(studentList?.data || []);
  }, [studentList]);

  const handleDayChange = (event: SelectChangeEvent) => {
    setDay(event.target.value as string);
  };

  const handleNameChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const newName = event.target.value;

    if (newName.length <= 26) {
      setName(newName);
      setNameError('');
    } else {
      setNameError('Name cannot exceed 26 characters');
    }
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
    if (
      day === '' ||
      name === '' ||
      startTime === '' ||
      endTime === '' ||
      zoom === '' ||
      teacher === null
    ) {
      setError(true);
      return;
    }
    editBlock({
      blockId,
      day,
      name,
      startTime,
      endTime,
      zoom,
      pairs,
    });
    window.location.reload();
  };

  return valid ? (
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
            Edit Block
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
              {nameError && (
                <Typography justifyContent="center" color="red">
                  {nameError}
                </Typography>
              )}
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
                  Please fill out all fields
                </Typography>
              </Grid>
            )}
          </FormCol>
        </FormGrid>
      </Grid>
    </div>
  ) : (
    <div />
  );
}

export default AdminEditBlockPage;
