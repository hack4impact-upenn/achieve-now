import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { Stack } from '@mui/system';
import { DatePicker } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';
import React, { useEffect, useState } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import theme from '../assets/theme';
import useAlert from '../util/hooks/useAlert';
import AlertType from '../util/types/alert';

interface IAdminNotesRow {
  key: string;
  date: string;
  privateStudentObservations: string;
  privateStudentNextSteps: string;
  publicStudentObservations: string;
  publicStudentNextSteps: string;
  coachObservations: string;
  coachNextSteps: string;
}

interface AddDateProps {
  open: boolean;
  setOpen: (newOpen: boolean) => void;
  addDate: (
    date: number,
    privateStudentObservations: string,
    privateStudentNextSteps: string,
    publicStudentObservations: string,
    publicStudentNextSteps: string,
    coachObservations: string,
    coachNextSteps: string,
  ) => void;
  table: IAdminNotesRow[];
}

function AddDateNotesDialog({ open, setOpen, addDate, table }: AddDateProps) {
  const [date, setDate] = useState<Dayjs | null>(null);
  const [privateStudentObservations, setPrivateStudentObservations] =
    useState('');
  const [privateStudentNextSteps, setPrivateStudentNextSteps] = useState('');
  const [publicStudentObservations, setPublicStudentObservations] =
    useState('');
  const [publicStudentNextSteps, setPublicStudentNextSteps] = useState('');
  const [coachObservations, setCoachObservations] = useState('');
  const [coachNextSteps, setCoachNextSteps] = useState('');
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { setAlert } = useAlert();

  useEffect(() => {
    if (date) {
      const numberDate = Number(date).toString();
      const row = table.find((r: IAdminNotesRow) => r.key === numberDate);
      if (row) {
        setError(true);
        setErrorMessage('Date already exists');
      } else {
        setError(false);
      }
    }
  }, [date, table]);

  const handleSubmit = () => {
    if (!date) {
      setErrorMessage('Please provide a date');
      setError(true);
    }
    if (!date || error) {
      return;
    }

    addDate(
      Number(date),
      privateStudentObservations,
      privateStudentNextSteps,
      publicStudentObservations,
      publicStudentNextSteps,
      coachObservations,
      coachNextSteps,
    );
    setDate(null);
    setPrivateStudentObservations('');
    setPrivateStudentNextSteps('');
    setPublicStudentObservations('');
    setPublicStudentNextSteps('');
    setCoachObservations('');
    setCoachNextSteps('');
    setOpen(false);
    setAlert('Note added successfully!', AlertType.SUCCESS);
  };

  const handleClose = () => {
    setOpen(false);
  };

  let errorComponent = null;
  if (error) {
    errorComponent = (
      <Grid item width="1">
        <Typography color={theme.palette.error.main}>{errorMessage}</Typography>
      </Grid>
    );
  }
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
              label="Private Student Observations"
              value={privateStudentObservations}
              onChange={(event) =>
                setPrivateStudentObservations(event.target.value)
              }
            />
          </Grid>
          <Grid item width="1">
            <TextField
              fullWidth
              multiline
              label="Private Student Next Steps"
              value={privateStudentNextSteps}
              onChange={(event) =>
                setPrivateStudentNextSteps(event.target.value)
              }
            />
          </Grid>
          <Grid item width="1">
            <TextField
              fullWidth
              multiline
              label="Public Student Observations"
              value={publicStudentObservations}
              onChange={(event) =>
                setPublicStudentObservations(event.target.value)
              }
            />
          </Grid>
          <Grid item width="1">
            <TextField
              fullWidth
              multiline
              label="Public Student Next Steps"
              value={publicStudentNextSteps}
              onChange={(event) =>
                setPublicStudentNextSteps(event.target.value)
              }
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
          {errorComponent}
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

export default AddDateNotesDialog;
