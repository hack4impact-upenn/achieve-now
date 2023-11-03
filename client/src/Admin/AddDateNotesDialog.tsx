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
import React, { useState } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

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
}

function AddDateNotesDialog({ open, setOpen, addDate }: AddDateProps) {
  const [date, setDate] = useState<Dayjs | null>(null);
  const [studentObservations, setStudentObservations] = useState('');
  const [studentNextSteps, setStudentNextSteps] = useState('');
  const [coachObservations, setCoachObservations] = useState('');
  const [coachNextSteps, setCoachNextSteps] = useState('');

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
