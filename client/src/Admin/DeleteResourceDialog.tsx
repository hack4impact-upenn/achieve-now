import {
  Dialog,
  DialogActions,
  DialogTitle,
  MenuItem,
  Select,
  Stack,
} from '@mui/material';
import React, { useState } from 'react';
import PrimaryButton from '../components/buttons/PrimaryButton';

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
              <MenuItem value={r.title} key={r._id}>
                {r.title}
              </MenuItem>
            ))}
          </Select>

          <PrimaryButton onClick={handleSubmit}>Delete</PrimaryButton>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteResourceDialog;
