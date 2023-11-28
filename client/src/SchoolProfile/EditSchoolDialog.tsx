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
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import React, { useEffect, useState, useMemo } from 'react';
import theme from '../assets/theme';
import ISchool from '../util/types/school';

interface EditSchoolProps {
  open: boolean;
  setOpen: (newOpen: boolean) => void;
  schools: ISchool[];
  editSchool: (
    id: string,
    name: string,
    info: string,
    teachers: string,
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
  const [id, setId] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [info, setInfo] = useState<string | ''>('');
  const [teachers, setTeachers] = useState<string | ''>('');
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

  useEffect(() => {
    const school = schools.find((r) => r.name === name);
    if (school) {
      setId(school._id); /* eslint no-underscore-dangle: 0 */
      setTeachers(school.teachers);
      setInfo(school.info);
      setAdminName(school.admin_name);
      setAdminContent(school.admin_content);
      setCalendarLink(school.calendar_link);
      setSchoolStartTime(school.school_start_time);
      setSchoolEndTime(school.school_end_time);
      setFirstGradeLunchStartTime(school.first_grade_lunch_start_time);
      setFirstGradeLunchEndTime(school.first_grade_lunch_end_time);
      setSecondGradeLunchStartTime(school.second_grade_lunch_start_time);
      setSecondGradeLunchEndTime(school.second_grade_lunch_end_time);
    }
  }, [name, schools]);

  const handleSubmit = () => {
    if (!name || !info || !admin_name) {
      return;
    }
    editSchool(
      id,
      name,
      info,
      teachers,
      admin_name,
      admin_content,
      calendar_link,
      school_start_time,
      school_end_time,
      first_grade_lunch_start_time,
      first_grade_lunch_end_time,
      second_grade_lunch_start_time,
      second_grade_lunch_end_time,
    );
    setOpen(false);
  };

  const options = useMemo(
    () => schools.map((school) => school.name),
    [schools],
  );

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
              value={name}
              sx={{
                minWidth: 150,
              }}
              onChange={(event) => setName(event.target.value)}
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
              value={info}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setInfo(event.target.value);
              }}
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
            <OutlinedInput
              id="teachers-field"
              value={teachers}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setTeachers(event.target.value);
              }}
              label="Teachers"
            />
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
              value={admin_name}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setAdminName(event.target.value);
              }}
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
              value={admin_content}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setAdminContent(event.target.value);
              }}
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
              value={calendar_link}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setCalendarLink(event.target.value);
              }}
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
              value={dayjs(school_start_time)}
              openTo="hours"
              onChange={(newValue) =>
                setSchoolStartTime(newValue as Date | null)
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
              value={dayjs(school_end_time)}
              openTo="hours"
              onChange={(newValue) => setSchoolEndTime(newValue as Date | null)}
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
              value={dayjs(first_grade_lunch_start_time)}
              openTo="hours"
              onChange={(newValue) =>
                setFirstGradeLunchStartTime(newValue as Date | null)
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
              value={dayjs(first_grade_lunch_end_time)}
              openTo="hours"
              onChange={(newValue) =>
                setFirstGradeLunchEndTime(newValue as Date | null)
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
              value={dayjs(second_grade_lunch_start_time)}
              openTo="hours"
              onChange={(newValue) =>
                setSecondGradeLunchStartTime(newValue as Date | null)
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
              value={dayjs(second_grade_lunch_end_time)}
              openTo="hours"
              onChange={(newValue) =>
                setSecondGradeLunchEndTime(newValue as Date | null)
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
