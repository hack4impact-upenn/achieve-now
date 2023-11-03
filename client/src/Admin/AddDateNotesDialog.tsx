import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
  TextField,
} from '@mui/material';
import { Stack } from '@mui/system';
import { DatePicker } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';
import React, { useEffect, useState } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import IStudent from '../util/types/student';
import ICoach from '../util/types/coach';

interface AddDateProps {
  open: boolean;
  setOpen: (newOpen: boolean) => void;
  addDate: (
    date: number,
    studentObservations: string,
    studentNextSteps: string,
    coachObservations: string,
    coachNextSteps: string,
  ) => void;
  student: IStudent | null;
  coach: ICoach | null;
}

function AddDateNotesDialog({
  open,
  setOpen,
  addDate,
  student,
  coach,
}: AddDateProps) {
  const [date, setDate] = useState<Dayjs | null>(null);
  const [studentObservations, setStudentObservations] = useState('');
  const [studentNextSteps, setStudentNextSteps] = useState('');
  const [coachObservations, setCoachObservations] = useState('');
  const [coachNextSteps, setCoachNextSteps] = useState('');

  useEffect(() => {
    if (date && student && coach) {
      const numberDate = Number(date).toString();
      if (student.progress_stats !== null) {
        if (
          Object.keys(student.progress_stats).includes('student_observations')
        ) {
          const innerMap = student.progress_stats.get('student_observations');
          if (innerMap?.has(numberDate)) {
            setStudentObservations(innerMap.get(numberDate) || '');
          }
        }
        if (
          Object.keys(student.progress_stats).includes('student_next_steps')
        ) {
          const innerMap = student.progress_stats.get('student_next_steps');
          if (innerMap?.has(numberDate)) {
            setStudentNextSteps(innerMap.get(numberDate) || '');
          }
        }
      }
      if (coach.progress_stats !== null) {
        if (Object.keys(coach.progress_stats).includes('coach_observations')) {
          const innerMap = coach.progress_stats.get('coach_observations');
          if (innerMap?.has(numberDate)) {
            setCoachObservations(innerMap.get(numberDate) || '');
          }
        }
        if (Object.keys(coach.progress_stats).includes('coach_next_steps')) {
          const innerMap = coach.progress_stats.get('coach_next_steps');
          if (innerMap?.has(numberDate)) {
            setStudentNextSteps(innerMap.get(numberDate) || '');
          }
        }
      }
    }
  }, [date, coach, student]);

  const handleSubmit = () => {
    if (!date) {
      return;
    }
    addDate(
      Number(date),
      studentObservations,
      studentNextSteps,
      coachObservations,
      coachNextSteps,
    );
    setDate(null);
    setStudentObservations('');
    setStudentNextSteps('');
    setCoachObservations('');
    setCoachNextSteps('');
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>Add Entry</DialogTitle>
      <DialogActions
        sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}
      >
        <Stack direction="column" spacing={2}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              value={date}
              onChange={(newValue) => setDate(newValue)}
            />
          </LocalizationProvider>
          <Grid item width="1">
            <TextField
              fullWidth
              label="Student Observations"
              value={studentObservations}
              onChange={(event) => setStudentObservations(event.target.value)}
            />
          </Grid>
          <Grid item width="1">
            <TextField
              fullWidth
              label="Student Next Steps"
              value={studentNextSteps}
              onChange={(event) => setStudentNextSteps(event.target.value)}
            />
          </Grid>
          <Grid item width="1">
            <TextField
              fullWidth
              label="Coach Observations"
              value={coachObservations}
              onChange={(event) => setCoachObservations(event.target.value)}
            />
          </Grid>
          <Grid item width="1">
            <TextField
              fullWidth
              label="Coach Next Steps"
              value={coachNextSteps}
              onChange={(event) => setCoachNextSteps(event.target.value)}
            />
          </Grid>
          <Button variant="outlined" onClick={handleSubmit}>
            Submit
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

export default AddDateNotesDialog;
