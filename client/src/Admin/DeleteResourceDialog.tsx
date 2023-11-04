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

interface DeleteResourceProps {
  open: boolean;
  setOpen: (newOpen: boolean) => void;
  options: string[];
  deleteResource: (r: string) => void;
}

function DeleteResourceDialog({
  open,
  setOpen,
  options,
  deleteResource,
}: DeleteResourceProps) {
  const [resource, setResource] = useState<string>('');

  const handleSubmit = () => {
    if (!resource) {
      return;
    }
    deleteResource(resource);
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle sx={{ textAlign: 'center' }}>Delete Entry</DialogTitle>
      <DialogActions
        sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ width: '100%', justifyContent: 'space-between' }}
        >
          <Select
            value={resource}
            sx={{
              minWidth: 150,
            }}
            onChange={(event) => setResource(event.target.value)}
          >
            {options.map((option) => (
              <MenuItem value={option}>{option}</MenuItem>
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

export default DeleteResourceDialog;
