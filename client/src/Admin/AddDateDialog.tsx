import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import { Stack } from '@mui/system';
import { DatePicker } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';
import React, { useState } from 'react';

interface AddDateProps {
  open: boolean;
  setOpen: (newOpen: boolean) => void;
  addDate: (date: number) => void;
}

function AddDateDialog({ open, setOpen, addDate }: AddDateProps) {
  const [date, setDate] = useState<Dayjs | null>(null);

  const handleSubmit = () => {
    if (!date) {
      return;
    }
    addDate(date.unix());
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle sx={{ textAlign: 'center' }}>Add Date</DialogTitle>
      <DialogActions
        sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}
      >
        <Stack direction="row" spacing={2}>
          <DatePicker value={date} onChange={(newValue) => setDate(newValue)} />
          <Button variant="outlined" onClick={handleSubmit}>
            Submit
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

export default AddDateDialog;
