/* eslint-disable camelcase */
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import { Stack } from '@mui/system';
import { DatePicker } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import ISchool from '../util/types/school';

interface AddSchoolProps {
  open: boolean;
  setOpen: (newOpen: boolean) => void;
  addSchool: (
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

function AddSchoolDialog({ open, setOpen, addSchool }: AddSchoolProps) {
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

  const handleSubmit = () => {
    if (!name || !info) {
      return;
    }
    addSchool(
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
    console.log('added');
    setOpen(false);
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
            defaultValue="School Name"
            onChange={(event) => setName(event.target.value)}
          />
          <br />
          <TextField
            label="Info"
            defaultValue="Info"
            onChange={(event) => setInfo(event.target.value)}
          />
          <br />
          <TextField
            label="Teachers"
            defaultValue="Teachers"
            onChange={(event) => setTeachers(event.target.value)}
          />
          <br />
          <TextField
            label="Admin Name"
            defaultValue="Admin Name"
            onChange={(event) => setAdminName(event.target.value)}
          />
          <br />
          <TextField
            label="Admin Content"
            defaultValue="Admin Content"
            onChange={(event) => setAdminContent(event.target.value)}
          />
          <br />
          <TextField
            label="Calendar Link"
            defaultValue="Calendar Link"
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
