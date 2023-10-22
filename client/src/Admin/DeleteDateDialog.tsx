import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  MenuItem,
  Select,
} from '@mui/material';
import dayjs from 'dayjs';
import React, { useState } from 'react';

interface DeleteDateDialogProps {
  open: boolean;
  setOpen: (newOpen: boolean) => void;
  options: number[];
  deleteDate: (date: number) => void;
}

function DeleteDateDialog({
  open,
  setOpen,
  options,
  deleteDate,
}: DeleteDateDialogProps) {
  const [date, setDate] = useState<number | null>(null);

  const handleSubmit = () => {
    if (!date) {
      return;
    }
    deleteDate(date);
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Delete Date</DialogTitle>
      <DialogActions>
        <Select
          value={date}
          onChange={(event) => setDate(event.target.value as number)}
        >
          {options.map((option) => (
            <MenuItem value={option}>
              {dayjs.unix(option).format('MM/DD/YY')}
            </MenuItem>
          ))}
        </Select>
        <Button variant="outlined" onClick={handleSubmit}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteDateDialog;
