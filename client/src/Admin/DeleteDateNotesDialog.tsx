import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  MenuItem,
  Select,
  Stack,
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
      <DialogTitle sx={{ textAlign: 'center' }}>Delete Date</DialogTitle>
      <DialogActions
        sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ width: '100%', justifyContent: 'space-between' }}
        >
          <Select
            value={date}
            sx={{
              minWidth: 150,
            }}
            onChange={(event) => setDate(event.target.value as number)}
          >
            {options.map((option) => (
              <MenuItem value={option}>
                {new Date(option).toLocaleDateString()}
              </MenuItem>
            ))}
          </Select>
          <Button variant="outlined" onClick={handleSubmit}>
            Submit
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteDateDialog;
