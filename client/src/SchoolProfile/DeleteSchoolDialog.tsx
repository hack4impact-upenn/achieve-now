/* eslint-disable camelcase */
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  MenuItem,
  Select,
  Stack,
} from '@mui/material';
import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import ISchool from '../util/types/school';

interface DeleteSchoolDialogProps {
  open: boolean;
  setOpen: (newOpen: boolean) => void;
  // options: { id: string; schoolName: string }[];
  options: ISchool[];
  deleteSchool: (id: string) => void;
}

function DeleteSchoolDialog({
  open,
  setOpen,
  options,
  deleteSchool,
}: DeleteSchoolDialogProps) {
  const [schoolId, setSchool] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!schoolId) {
      return;
    }
    deleteSchool(schoolId);
    setOpen(false);
  };

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={() => setOpen(false)}>
      <DialogTitle sx={{ textAlign: 'center' }}>Delete School</DialogTitle>
      <DialogActions
        sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}
      >
        <Stack
          direction="column"
          spacing={2}
          sx={{ width: '50%', justifyContent: 'space-between' }}
        >
          <Select
            value={schoolId}
            onChange={(event) => setSchool(event.target.value as string)}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 200, // Set your desired maxHeight here
                },
              },
            }}
          >
            {/* eslint-disable-next-line */}
            {options &&
              options.map((option) => (
                // eslint-disable-next-line
                <MenuItem value={option._id}>{option.name}</MenuItem>
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

export default DeleteSchoolDialog;
