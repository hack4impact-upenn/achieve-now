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

interface IAdminNotesRow {
  key: string;
  date: string;
  studentObservations: string;
  studentNextSteps: string;
  coachObservations: string;
  coachNextSteps: string;
}

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
  table: IAdminNotesRow[];
}

function AddDateNotesDialog({ open, setOpen, addDate, table }: AddDateProps) {
  const [date, setDate] = useState<Dayjs | null>(null);
  const [studentObservations, setStudentObservations] = useState('');
  const [studentNextSteps, setStudentNextSteps] = useState('');
  const [coachObservations, setCoachObservations] = useState('');
  const [coachNextSteps, setCoachNextSteps] = useState('');

  useEffect(() => {
    if (date) {
      const numberDate = Number(date).toString();
      const row = table.find((r: IAdminNotesRow) => r.key === numberDate);
      if (row) {
        setStudentObservations(row.studentObservations);
        setStudentNextSteps(row.studentNextSteps);
        setCoachObservations(row.coachObservations);
        setCoachNextSteps(row.coachNextSteps);
      }
    }
  }, [date, table]);

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
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          paddingBottom: 5,
        }}
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
              multiline
              label="Student Observations"
              value={studentObservations}
              onChange={(event) => setStudentObservations(event.target.value)}
            />
          </Grid>
          <Grid item width="1">
            <TextField
              fullWidth
              multiline
              label="Student Next Steps"
              value={studentNextSteps}
              onChange={(event) => setStudentNextSteps(event.target.value)}
            />
          </Grid>
          <Grid item width="1">
            <TextField
              fullWidth
              multiline
              label="Coach Observations"
              value={coachObservations}
              onChange={(event) => setCoachObservations(event.target.value)}
            />
          </Grid>
          <Grid item width="1">
            <TextField
              fullWidth
              multiline
              label="Coach Next Steps"
              value={coachNextSteps}
              onChange={(event) => setCoachNextSteps(event.target.value)}
            />
          </Grid>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

export default AddDateNotesDialog;
