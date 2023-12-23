import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  MenuItem,
  Select,
  Stack,
  Grid,
  TextField,
} from '@mui/material';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
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

interface EditDateDialogProps {
  open: boolean;
  setOpen: (newOpen: boolean) => void;
  options: number[];
  editDate: (
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

function EditDateDialog({
  open,
  setOpen,
  options,
  editDate,
  table,
}: EditDateDialogProps) {
  const [date, setDate] = useState<number | null>(null);
  const [privateStudentObservations, setPrivateStudentObservations] =
    useState('');
  const [privateStudentNextSteps, setPrivateStudentNextSteps] = useState('');
  const [publicStudentObservations, setPublicStudentObservations] =
    useState('');
  const [publicStudentNextSteps, setPublicStudentNextSteps] = useState('');
  const [coachObservations, setCoachObservations] = useState('');
  const [coachNextSteps, setCoachNextSteps] = useState('');
  const { setAlert } = useAlert();

  useEffect(() => {
    if (date) {
      const numberDate = Number(date).toString();
      const row = table.find((r: IAdminNotesRow) => r.key === numberDate);
      if (row) {
        setPrivateStudentObservations(row.privateStudentObservations);
        setPrivateStudentNextSteps(row.privateStudentNextSteps);
        setPublicStudentObservations(row.publicStudentObservations);
        setPublicStudentNextSteps(row.publicStudentNextSteps);
        setCoachObservations(row.coachObservations);
        setCoachNextSteps(row.coachNextSteps);
      }
    }
  }, [date, table]);

  const handleSubmit = () => {
    if (!date) {
      return;
    }
    editDate(
      date,
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
    setAlert('Note edited successfully!', AlertType.SUCCESS);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>Edit Date</DialogTitle>
      <DialogActions
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          paddingBottom: 5,
        }}
      >
        <Stack direction="column" spacing={2}>
          <Select
            value={date}
            sx={{
              minWidth: 150,
            }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 36 * 5,
                },
              },
            }}
            onChange={(event) => setDate(event.target.value as number)}
          >
            {options.map((option) => (
              <MenuItem value={option}>
                {new Date(option).toLocaleDateString()}
              </MenuItem>
            ))}
          </Select>
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
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

export default EditDateDialog;
