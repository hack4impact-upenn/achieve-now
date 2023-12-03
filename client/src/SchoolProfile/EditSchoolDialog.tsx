/* eslint-disable camelcase */

import {
  Button,
  Select,
  SelectChangeEvent,
  MenuItem,
  Dialog,
  DialogActions,
  DialogTitle,
  FormControl,
  OutlinedInput,
  InputLabel,
} from '@mui/material';
import dayjs from 'dayjs';
import { Stack } from '@mui/system';
import Chip from '@mui/material/Chip';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import React, { useEffect, useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import theme from '../assets/theme';
import ISchool from '../util/types/school';
import useAlert from '../util/hooks/useAlert';
import { useData } from '../util/api';
import IUser from '../util/types/user';
import AlertType from '../util/types/alert';
// import submitError from './AddSchoolDialog';

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

interface EditSchoolProps {
  open: boolean;
  setOpen: (newOpen: boolean) => void;
  schools: ISchool[];
  editSchool: (
    id: string,
    name: string,
    info: string,
    teachers: string[],
    admin_name: string,
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

function EditSchoolDialog({
  open,
  setOpen,
  schools,
  editSchool,
}: EditSchoolProps) {
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
  // const [name, setName] = useState<string>('');
  const users = useData('admin/all');
  const { setAlert } = useAlert();
  const [teacherName, setTeacherName] = React.useState<string[]>([]);

  const [id, setId] = useState<string>('');

  useEffect(() => {
    const school = schools.find((r) => r.name === state.name);
    if (school) {
      // eslint-disable-next-line no-underscore-dangle
      setId(school._id);
      setState({
        // eslint-disable-next-line no-underscore-dangle
        name: state.name,
        info: school.info,
        admin_name: school.admin_name,
        teachers: school.teachers,
        admin_content: school.admin_content,
        calendar_link: school.calendar_link,
        school_start_time: school.school_start_time,
        school_end_time: school.school_end_time,
        first_grade_lunch_start_time: school.first_grade_lunch_start_time,
        first_grade_lunch_end_time: school.first_grade_lunch_end_time,
        second_grade_lunch_start_time: school.second_grade_lunch_start_time,
        second_grade_lunch_end_time: school.second_grade_lunch_end_time,
      });
    }
  }, [state.name, schools]);

  useEffect(() => {
    const allUsers = users?.data || [];
    let filteredUsers = allUsers;
    filteredUsers = filteredUsers.filter((user: IUser) => {
      return user.role === 'teacher';
    });
    setUserList(allUsers);
    setTeacherList(filteredUsers);
  }, [users]);

  const handleSubmit = () => {
    console.log('submitted');
    const desc = submitError(state);
    if (desc) {
      setError(desc);
      console.log('error');
      return;
    }
    editSchool(
      id,
      state.name,
      state.info,
      state.teachers,
      state.admin_name,
      state.admin_content,
      state.calendar_link,
      state.school_start_time,
      state.school_end_time,
      state.first_grade_lunch_start_time,
      state.first_grade_lunch_end_time,
      state.second_grade_lunch_start_time,
      state.second_grade_lunch_end_time,
    );
    setAlert('Edited school successfully!', AlertType.SUCCESS);
    setOpen(false);
  };

  const options = useMemo(
    () => schools.map((school) => school.name),
    [schools],
  );

  const handleChangeInfo = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState((prevState) => ({
      ...prevState,
      info: event.target.value,
    }));
  };
  const handleChangeName = (event: SelectChangeEvent<string>) => {
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

    setState((prevState) => ({
      ...prevState,
      teachers: selectedTeacherIds,
    }));
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle sx={{ textAlign: 'center' }}>Edit Entry</DialogTitle>
      <DialogActions
        sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}
      >
        <Stack spacing={2}>
          <FormControl
            variant="outlined"
            sx={{
              marginRight: theme.spacing(2),
            }}
          >
            <InputLabel htmlFor="title-field">School Name</InputLabel>
            <Select
              id="name-field"
              label="School Name"
              value={state.name}
              sx={{
                minWidth: 150,
              }}
              onChange={handleChangeName}
            >
              {options.map((option) => (
                <MenuItem value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            variant="outlined"
            sx={{
              marginRight: theme.spacing(2),
            }}
          >
            <InputLabel htmlFor="description-field">Info</InputLabel>
            <OutlinedInput
              id="info-field"
              value={state.info}
              onChange={handleChangeInfo}
              label="Info"
            />
          </FormControl>
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
          <FormControl
            variant="outlined"
            sx={{
              marginRight: theme.spacing(2),
            }}
          >
            <InputLabel htmlFor="link-field">Admin Name</InputLabel>
            <OutlinedInput
              id="admin-field"
              value={state.admin_name}
              onChange={handleChangeAdminName}
              label="Admins"
            />
          </FormControl>
          <FormControl
            variant="outlined"
            sx={{
              marginRight: theme.spacing(2),
            }}
          >
            <InputLabel htmlFor="link-field">Admin Content</InputLabel>
            <OutlinedInput
              id="admin-content-field"
              value={state.admin_content}
              onChange={handleChangeAdminContent}
              label="Admin Content"
            />
          </FormControl>
          <FormControl
            variant="outlined"
            sx={{
              marginRight: theme.spacing(2),
            }}
          >
            <InputLabel htmlFor="link-field">Calendar Link</InputLabel>
            <OutlinedInput
              id="calendarlink-field"
              value={state.calendar_link}
              onChange={handleChangeCalendarLink}
              label="Calendar Link"
            />
          </FormControl>
          <FormControl
            variant="outlined"
            sx={{
              marginRight: theme.spacing(2),
            }}
          >
            <MobileTimePicker
              label="School Start Time"
              value={dayjs(state.school_start_time)}
              openTo="hours"
              onChange={(newValue) =>
                handleChangeSchoolStartTime(newValue as Date | null)
              }
            />
          </FormControl>
          <FormControl
            variant="outlined"
            sx={{
              marginRight: theme.spacing(2),
            }}
          >
            <MobileTimePicker
              label="School End Time"
              value={dayjs(state.school_end_time)}
              openTo="hours"
              onChange={(newValue) =>
                handleChangeSchoolEndTime(newValue as Date | null)
              }
            />
          </FormControl>
          <FormControl
            variant="outlined"
            sx={{
              marginRight: theme.spacing(2),
            }}
          >
            <MobileTimePicker
              label="First Grade Lunch Start Time"
              value={dayjs(state.first_grade_lunch_start_time)}
              openTo="hours"
              onChange={(newValue) =>
                handleChangeFirstGradeStartTime(newValue as Date | null)
              }
            />
          </FormControl>
          <FormControl
            variant="outlined"
            sx={{
              marginRight: theme.spacing(2),
            }}
          >
            <MobileTimePicker
              label="First Grade Lunch End Time"
              value={dayjs(state.first_grade_lunch_end_time)}
              openTo="hours"
              onChange={(newValue) =>
                handleChangeFirstGradeEndTime(newValue as Date | null)
              }
            />
          </FormControl>
          <FormControl
            variant="outlined"
            sx={{
              marginRight: theme.spacing(2),
            }}
          >
            <MobileTimePicker
              label="Second Grade Lunch Start Time"
              value={dayjs(state.second_grade_lunch_start_time)}
              openTo="hours"
              onChange={(newValue) =>
                handleChangeSecondGradeStartTime(newValue as Date | null)
              }
            />
          </FormControl>
          <FormControl
            variant="outlined"
            sx={{
              marginRight: theme.spacing(2),
            }}
          >
            <MobileTimePicker
              label="Second Grade Lunch End Time"
              value={dayjs(state.second_grade_lunch_end_time)}
              openTo="hours"
              onChange={(newValue) =>
                handleChangeSecondGradeEndTime(newValue as Date | null)
              }
            />
          </FormControl>
          <Button variant="outlined" onClick={handleSubmit}>
            Submit
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

export default EditSchoolDialog;
