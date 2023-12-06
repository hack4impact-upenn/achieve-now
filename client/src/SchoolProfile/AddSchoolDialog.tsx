/* eslint-disable camelcase */
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Typography,
  Grid,
} from '@mui/material';
import { Stack } from '@mui/system';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { Theme, useTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { useData } from '../util/api';
import IUser from '../util/types/user';
import useAlert from '../util/hooks/useAlert';
import AlertType from '../util/types/alert';
import theme from '../assets/theme';

interface SubmitState {
  name: string;
  info: string;
  admin_name: string;
  teachers: string[];
  admin_content: string;
  calendar_link: string;
  school_start_time: Date | null;
  school_end_time: Date | null;
  first_grade_lunch_start_time: Date | null;
  first_grade_lunch_end_time: Date | null;
  second_grade_lunch_start_time: Date | null;
  second_grade_lunch_end_time: Date | null;
}

interface AddSchoolProps {
  open: boolean;
  setOpen: (newOpen: boolean) => void;
  addSchool: (
    name: string,
    info: string,
    admin_name: string,
    teachers: string[],
    admin_content: string,
    calendar_link: string,
    school_start_time: Date | null,
    school_end_time: Date | null,
    first_grade_lunch_start_time: Date | null,
    first_grade_lunch_end_time: Date | null,
    second_grade_lunch_start_time: Date | null,
    second_grade_lunch_end_time: Date | null,
  ) => void;
}

function submitError({
  name,
  info,
  admin_name,
  teachers,
  admin_content,
  calendar_link,
  school_start_time,
  school_end_time,
  first_grade_lunch_start_time,
  first_grade_lunch_end_time,
  second_grade_lunch_start_time,
  second_grade_lunch_end_time,
}: SubmitState): string {
  if (
    name === '' ||
    info === '' ||
    admin_name === '' ||
    teachers.length === 0 ||
    admin_content === '' ||
    calendar_link === '' ||
    school_start_time === null ||
    school_end_time === null ||
    first_grade_lunch_start_time === null ||
    first_grade_lunch_end_time === null ||
    second_grade_lunch_start_time === null ||
    second_grade_lunch_end_time === null
  ) {
    return 'Please fill out all fields';
  }
  if (
    school_end_time < school_start_time ||
    first_grade_lunch_end_time < first_grade_lunch_start_time ||
    second_grade_lunch_end_time < second_grade_lunch_start_time
  ) {
    return 'Invalid times';
  }

  try {
    const _ = new URL(calendar_link);
  } catch (e) {
    return 'Invalid calendar link';
  }
  return '';
}

function AddSchoolDialog({ open, setOpen, addSchool }: AddSchoolProps) {
  const [state, setState] = useState<SubmitState>({
    name: '',
    info: '',
    admin_name: '',
    teachers: [],
    admin_content: '',
    calendar_link: '',
    school_start_time: null,
    school_end_time: null,
    first_grade_lunch_start_time: null,
    first_grade_lunch_end_time: null,
    second_grade_lunch_start_time: null,
    second_grade_lunch_end_time: null,
  });

  const [error, setError] = useState('');

  const [userList, setUserList] = useState<IUser[]>([]);
  const [teacherList, setTeacherList] = useState<IUser[]>([]);
  const [teachers, setTeachers] = useState<IUser[]>([]);
  const users = useData('admin/all');
  const { setAlert } = useAlert();

  useEffect(() => {
    const allUsers = users?.data || [];
    let filteredUsers = allUsers;
    filteredUsers = filteredUsers.filter((user: IUser) => {
      return user.role === 'teacher';
    });
    setUserList(allUsers);
    setTeacherList(filteredUsers);
  }, [users]);

  const reset = () => {
    setError('');
    setState({
      name: '',
      info: '',
      admin_name: '',
      teachers: [],
      admin_content: '',
      calendar_link: '',
      school_start_time: null,
      school_end_time: null,
      first_grade_lunch_start_time: null,
      first_grade_lunch_end_time: null,
      second_grade_lunch_start_time: null,
      second_grade_lunch_end_time: null,
    });
  };

  const handleSubmit = () => {
    console.log('submitted');
    const desc = submitError(state);
    if (desc) {
      setError(desc);
      console.log('error');
      return;
    }

    addSchool(
      state.name,
      state.info,
      state.admin_name,
      state.teachers,
      state.admin_content,
      state.calendar_link,
      state.school_start_time,
      state.school_end_time,
      state.first_grade_lunch_start_time,
      state.first_grade_lunch_end_time,
      state.second_grade_lunch_start_time,
      state.second_grade_lunch_end_time,
    );
    setAlert('Added school successfully!', AlertType.SUCCESS);
    reset();
    setOpen(false);
  };
  const defaultDate = dayjs('2022-04-17T00:00');

  const [teacherName, setTeacherName] = React.useState<string[]>([]);

  const handleChangeInfo = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState((prevState) => ({
      ...prevState,
      info: event.target.value,
    }));
  };
  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState((prevState) => ({
      ...prevState,
      name: event.target.value,
    }));
  };
  const handleChangeAdminName = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setState((prevState) => ({
      ...prevState,
      admin_name: event.target.value,
    }));
  };
  const handleChangeAdminContent = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setState((prevState) => ({
      ...prevState,
      admin_content: event.target.value,
    }));
  };
  const handleChangeCalendarLink = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setState((prevState) => ({
      ...prevState,
      calendar_link: event.target.value,
    }));
  };
  const handleChangeSchoolStartTime = (date: Date | null) => {
    setState((prevState) => ({
      ...prevState,
      school_start_time: date,
    }));
  };
  const handleChangeSchoolEndTime = (date: Date | null) => {
    setState((prevState) => ({
      ...prevState,
      school_end_time: date,
    }));
  };
  const handleChangeFirstGradeStartTime = (date: Date | null) => {
    setState((prevState) => ({
      ...prevState,
      first_grade_lunch_start_time: date,
    }));
  };
  const handleChangeFirstGradeEndTime = (date: Date | null) => {
    setState((prevState) => ({
      ...prevState,
      first_grade_lunch_end_time: date,
    }));
  };
  const handleChangeSecondGradeStartTime = (date: Date | null) => {
    setState((prevState) => ({
      ...prevState,
      second_grade_lunch_start_time: date,
    }));
  };
  const handleChangeSecondGradeEndTime = (date: Date | null) => {
    setState((prevState) => ({
      ...prevState,
      second_grade_lunch_end_time: date,
    }));
  };
  const handleChangeTeacher = (
    event: SelectChangeEvent<typeof teacherName>,
  ) => {
    const selectedTeacherIds = event.target.value as string[];

    console.log(selectedTeacherIds);

    setState((prevState) => ({
      ...prevState,
      teachers: selectedTeacherIds,
    }));
  };

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={() => setOpen(false)}>
      <DialogTitle sx={{ textAlign: 'center' }}>Add School</DialogTitle>
      <DialogActions
        sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}
      >
        <Stack direction="column" spacing={2}>
          <TextField label="School Name" onChange={handleChangeName} />
          <br />
          <TextField label="Info" onChange={handleChangeInfo} />
          <br />
          <FormControl
            variant="outlined"
            sx={{
              marginRight: theme.spacing(2),
            }}
          >
            <InputLabel htmlFor="link-field">Teachers</InputLabel>
            <Select
              multiple
              value={state.teachers}
              onChange={handleChangeTeacher}
              label="Teachers"
              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected
                    .map((teacherId) => {
                      const selectedTeacher = teacherList.find(
                        // eslint-disable-next-line no-underscore-dangle
                        (teacher) => teacher._id === teacherId,
                      );
                      return selectedTeacher
                        ? `${selectedTeacher.firstName} ${selectedTeacher.lastName}`
                        : '';
                    })
                    .map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                </Box>
              )}
            >
              {teacherList.map((teacher: IUser) => (
                // eslint-disable-next-line no-underscore-dangle
                <MenuItem key={teacher._id} value={teacher._id}>
                  {`${teacher.firstName} ${teacher.lastName}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <br />
          <TextField label="Admin Name" onChange={handleChangeAdminName} />
          <br />
          <TextField
            label="Admin Content"
            onChange={handleChangeAdminContent}
          />
          <br />
          <TextField
            label="Calendar Link"
            onChange={handleChangeCalendarLink}
          />
          <br />
          <MobileTimePicker
            label="School Start Time"
            openTo="hours"
            onChange={(newValue) =>
              handleChangeSchoolStartTime(newValue as Date | null)
            }
          />
          <br />
          <MobileTimePicker
            label="School End Time"
            openTo="hours"
            // defaultValue={defaultDate}
            onChange={(newValue) =>
              handleChangeSchoolEndTime(newValue as Date | null)
            }
          />
          <br />
          <MobileTimePicker
            label="First Grade Lunch Start Time"
            openTo="hours"
            // defaultValue={defaultDate}
            onChange={(newValue) =>
              handleChangeFirstGradeStartTime(newValue as Date | null)
            }
          />
          <br />
          <MobileTimePicker
            label="First Grade Lunch End Time"
            openTo="hours"
            // defaultValue={defaultDate}
            onChange={(newValue) =>
              handleChangeFirstGradeEndTime(newValue as Date | null)
            }
          />
          <br />
          <MobileTimePicker
            label="Second Grade Lunch Start Time"
            openTo="hours"
            // defaultValue={defaultDate}
            onChange={(newValue) =>
              handleChangeSecondGradeStartTime(newValue as Date | null)
            }
          />
          <br />
          <MobileTimePicker
            label="Second Grade Lunch End Time"
            openTo="hours"
            // defaultValue={defaultDate}
            onChange={(newValue) =>
              handleChangeSecondGradeEndTime(newValue as Date | null)
            }
          />
          <br />
          <Button variant="outlined" onClick={handleSubmit}>
            Submit
          </Button>
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
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

export default AddSchoolDialog;
