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
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle sx={{ textAlign: 'center' }}>Delete School</DialogTitle>
      <DialogActions
        sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ width: '100%', justifyContent: 'space-between' }}
        >
          <Select
            value={schoolId}
            sx={{
              minWidth: 150,
            }}
            onChange={(event) => setSchool(event.target.value as string)}
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
