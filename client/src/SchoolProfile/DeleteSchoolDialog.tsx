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
import useAlert from '../util/hooks/useAlert';
import AlertType from '../util/types/alert';

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
  const { setAlert } = useAlert();

  const handleSubmit = () => {
    if (!schoolId) {
      return;
    }
    deleteSchool(schoolId);
    setAlert('Deleted school successfully!', AlertType.SUCCESS);
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      sx={{
        '.MuiPaper-root': {
          padding: '1rem 3rem',
          minWidth: '50vw',
        },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center' }}>Delete Entry</DialogTitle>
      <DialogActions
        sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}
      >
        <Stack spacing={2} sx={{ paddingBottom: '2rem', width: '100%' }}>
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
