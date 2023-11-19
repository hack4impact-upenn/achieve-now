/* eslint-disable camelcase */
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import { Stack } from '@mui/system';
import { DatePicker } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';
import { Theme, useTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Box from '@mui/material/Box';
import { useData } from '../util/api';
import IUser from '../util/types/user';

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

function AddSchoolDialog({ open, setOpen, addSchool }: AddSchoolProps) {
  const [name, setName] = useState<string>('');
  const [info, setInfo] = useState<string | ''>('');
  const [teachers, setTeachers] = useState<string[] | []>([]);
  const [admin_name, setAdminName] = useState<string | ''>('');
  const [admin_content, setAdminContent] = useState<string | ''>('');
  const [calendar_link, setCalendarLink] = useState<string | ''>('');
  const [school_start_time, setSchoolStartTime] = useState<Date | null>(null);
  const [school_end_time, setSchoolEndTime] = useState<Date | null>(null);
  const [first_grade_lunch_start_time, setFirstGradeLunchStartTime] =
    useState<Date | null>(null);
  const [first_grade_lunch_end_time, setFirstGradeLunchEndTime] =
    useState<Date | null>(null);
  const [second_grade_lunch_start_time, setSecondGradeLunchStartTime] =
    useState<Date | null>(null);
  const [second_grade_lunch_end_time, setSecondGradeLunchEndTime] =
    useState<Date | null>(null);

  const [userList, setUserList] = useState<IUser[]>([]);
  const [teacherList, setTeacherList] = useState<IUser[]>([]);
  const [teacherNames, setTeacherNames] = useState<string[]>([]);
  const users = useData('admin/all');

  useEffect(() => {
    const allUsers = users?.data || [];
    let filteredUsers = allUsers;
    filteredUsers = filteredUsers.filter((user: IUser) => {
      return user.role === 'teacher';
    });
    setUserList(allUsers);
    setTeacherList(filteredUsers);
    const names: string[] = [];
    filteredUsers.map((teacher: IUser) =>
      names.push(`${teacher.firstName} ${teacher.lastName}`),
    );
    setTeacherNames(names);
  }, [users]);

  const handleSubmit = () => {
    if (!name || !info) {
      return;
    }
    addSchool(
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
    );
    console.log('added');
    setOpen(false);
  };

  const [teacherName, setTeacherName] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof teacherName>) => {
    const {
      target: { value },
    } = event;
    setTeacherName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
    setTeachers(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle sx={{ textAlign: 'center' }}>Add School</DialogTitle>
      <DialogActions
        sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}
      >
        <Stack direction="column" spacing={2}>
          <TextField
            label="School Name"
            onChange={(event) => setName(event.target.value)}
          />
          <br />
          <TextField
            label="Info"
            onChange={(event) => setInfo(event.target.value)}
          />
          <br />
          <Select
            multiple
            value={teacherName}
            onChange={handleChange}
            label="Teachers"
            input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {teacherNames.map((nameValue) => (
              <MenuItem key={nameValue} value={nameValue}>
                {nameValue}
              </MenuItem>
            ))}
          </Select>
          <br />
          <TextField
            label="Admin Name"
            onChange={(event) => setAdminName(event.target.value)}
          />
          <br />
          <TextField
            label="Admin Content"
            onChange={(event) => setAdminContent(event.target.value)}
          />
          <br />
          <TextField
            label="Calendar Link"
            onChange={(event) => setCalendarLink(event.target.value)}
          />
          <br />
          <MobileTimePicker
            label="School Start Time"
            openTo="hours"
            onChange={(newValue) => setSchoolStartTime(newValue as Date | null)}
          />
          <br />
          <MobileTimePicker
            label="School End Time"
            openTo="hours"
            onChange={(newValue) => setSchoolEndTime(newValue as Date | null)}
          />
          <br />
          <MobileTimePicker
            label="First Grade Lunch Start Time"
            openTo="hours"
            onChange={(newValue) =>
              setFirstGradeLunchStartTime(newValue as Date | null)
            }
          />
          <br />
          <MobileTimePicker
            label="First Grade Lunch End Time"
            openTo="hours"
            onChange={(newValue) =>
              setFirstGradeLunchEndTime(newValue as Date | null)
            }
          />
          <br />
          <MobileTimePicker
            label="Second Grade Lunch Start Time"
            openTo="hours"
            onChange={(newValue) =>
              setSecondGradeLunchStartTime(newValue as Date | null)
            }
          />
          <br />
          <MobileTimePicker
            label="Second Grade Lunch End Time"
            openTo="hours"
            onChange={(newValue) =>
              setSecondGradeLunchEndTime(newValue as Date | null)
            }
          />
          <br />
          <Button variant="outlined" onClick={handleSubmit}>
            Submit
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

export default AddSchoolDialog;
