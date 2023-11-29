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

interface IAdminNotesRow {
  key: string;
  date: string;
  studentObservations: string;
  studentNextSteps: string;
  coachObservations: string;
  coachNextSteps: string;
}

interface EditDateDialogProps {
  open: boolean;
  setOpen: (newOpen: boolean) => void;
  options: number[];
  editDate: (
    date: number,
    studentObservations: string,
    studentNextSteps: string,
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
    editDate(
      date,
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

export default EditDateDialog;
