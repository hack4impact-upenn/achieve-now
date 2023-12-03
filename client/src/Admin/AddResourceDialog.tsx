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
import PrimaryButton from '../components/buttons/PrimaryButton';
import AlertType from '../util/types/alert';
import useAlert from '../util/hooks/useAlert';

interface Resource {
  _id: string;
  title: string;
  description: string;
  link: string;
  type: string;
}

interface AddResourceProps {
  open: boolean;
  setOpen: (newOpen: boolean) => void;
  addResource: (
    title: string,
    description: string,
    link: string,
    type: string,
  ) => void;
  resources: Resource[];
}

function AddResourceDialog({
  open,
  setOpen,
  addResource,
  resources,
}: AddResourceProps) {
  const { setAlert } = useAlert();
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [link, setLink] = useState<string>('');
  const [type, setType] = useState<string>('');

  const handleSubmit = () => {
    if (!title || !description || !link || !type) {
      setAlert('Please fill out all fields', AlertType.ERROR);
      return;
    }
    try {
      const _ = new URL(link);
    } catch (e) {
      setAlert('Please enter a valid resource link', AlertType.ERROR);
      return;
    }
    if (type !== 'Video' && type !== 'Slides' && type !== 'Article') {
      setAlert('Please select a valid resource type', AlertType.ERROR);
      return;
    }
    for (let i = 0; i < resources.length; i += 1) {
      // eslint-disable-next-line no-underscore-dangle
      if (resources[i].title === title) {
        setAlert('A Resource with this title already exists', AlertType.ERROR);
        return;
      }
    }
    addResource(title, description, link, type);
    setAlert('Added resource successfully!', AlertType.SUCCESS);
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
      <DialogTitle sx={{ textAlign: 'center' }}>Add Entry</DialogTitle>
      <DialogActions
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        <Stack spacing={2} sx={{ paddingBottom: '2rem', width: '100%' }}>
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
            >
              <MenuItem value="Video">Video</MenuItem>
              <MenuItem value="Slides">Slides</MenuItem>
              <MenuItem value="Article">Article</MenuItem>
            </Select>
          </FormControl>
          <PrimaryButton onClick={handleSubmit}>Submit</PrimaryButton>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

export default AddResourceDialog;
