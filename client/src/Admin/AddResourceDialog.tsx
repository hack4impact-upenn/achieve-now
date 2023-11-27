import {
  Button,
  Select,
  SelectChangeEvent,
  MenuItem,
  Dialog,
  DialogActions,
  DialogTitle,
  FormControl,
  OutlinedInput,
  InputLabel,
} from '@mui/material';
import { Stack } from '@mui/system';
import React, { useState } from 'react';
import theme from '../assets/theme';

interface AddResourceProps {
  open: boolean;
  setOpen: (newOpen: boolean) => void;
  addResource: (
    title: string,
    description: string,
    link: string,
    type: string,
  ) => void;
}

function AddResourceDialog({ open, setOpen, addResource }: AddResourceProps) {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [link, setLink] = useState<string>('');
  const [type, setType] = useState<string>('');

  const handleSubmit = () => {
    if (!title || !description || !link || !type) {
      return;
    }
    addResource(title, description, link, type);
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      sx={{
        '.MuiPaper-root': {
          padding: '1rem 3rem',
        },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center' }}>Add Entry</DialogTitle>
      <DialogActions
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        <Stack spacing={2} sx={{ paddingBottom: '2rem' }}>
          <FormControl
            variant="outlined"
            sx={{
              marginRight: theme.spacing(2),
            }}
          >
            <InputLabel htmlFor="title-field">Title</InputLabel>
            <OutlinedInput
              id="title-field"
              value={title}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setTitle(event.target.value);
              }}
              label="Title"
            />
          </FormControl>
          <FormControl
            variant="outlined"
            sx={{
              marginRight: theme.spacing(2),
            }}
          >
            <InputLabel htmlFor="description-field">Description</InputLabel>
            <OutlinedInput
              id="description-field"
              value={description}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setDescription(event.target.value);
              }}
              label="Description"
              multiline
            />
          </FormControl>
          <FormControl
            variant="outlined"
            sx={{
              marginRight: theme.spacing(2),
            }}
          >
            <InputLabel htmlFor="link-field">Link</InputLabel>
            <OutlinedInput
              id="link-field"
              value={link}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setLink(event.target.value);
              }}
              label="Link"
            />
          </FormControl>
          <FormControl>
            <InputLabel id="resource-type-label">Type</InputLabel>
            <Select
              labelId="resource-type-label"
              value={type}
              onChange={(event: SelectChangeEvent<string>) => {
                setType(event.target.value);
              }}
              input={<OutlinedInput label="Type" />}
              sx={{ width: 200 }}
            >
              <MenuItem value="Video">Video</MenuItem>
              <MenuItem value="Slides">Slides</MenuItem>
              <MenuItem value="Article">Article</MenuItem>
            </Select>
          </FormControl>
          <Button variant="outlined" onClick={handleSubmit}>
            Submit
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

export default AddResourceDialog;
