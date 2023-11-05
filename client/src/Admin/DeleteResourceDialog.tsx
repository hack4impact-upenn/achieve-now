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

interface Resource {
  _id: string;
  title: string;
  description: string;
  link: string;
  type: string;
}

interface DeleteResourceProps {
  open: boolean;
  setOpen: (newOpen: boolean) => void;
  resources: Resource[];
  deleteResource: (r: string) => void;
}

function DeleteResourceDialog({
  open,
  setOpen,
  resources,
  deleteResource,
}: DeleteResourceProps) {
  const [resource, setResource] = useState<Resource | null>(null);

  const handleSubmit = () => {
    if (!resource) {
      return;
    }
    deleteResource(resource._id); /* eslint no-underscore-dangle: 0 */
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
            value={resource?.title || ''}
            sx={{
              minWidth: 150,
            }}
            onChange={(event) =>
              setResource(
                resources.find(
                  (r: Resource) => r.title === event.target.value,
                ) || null,
              )
            }
          >
            {resources.map((r: Resource) => (
              <MenuItem value={r.title}>{r.title}</MenuItem>
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
