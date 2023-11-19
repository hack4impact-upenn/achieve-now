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
import React, { useEffect, useState, useMemo } from 'react';
import theme from '../assets/theme';

interface Resource {
  _id: string;
  title: string;
  description: string;
  link: string;
  type: string;
}

interface EditResourceProps {
  open: boolean;
  setOpen: (newOpen: boolean) => void;
  resources: Resource[];
  editResource: (
    id: string,
    title: string,
    description: string,
    link: string,
    type: string,
  ) => void;
}

function EditResourceDialog({
  open,
  setOpen,
  resources,
  editResource,
}: EditResourceProps) {
  const [id, setId] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [link, setLink] = useState<string>('');
  const [type, setType] = useState<string>('');

  useEffect(() => {
    const resource = resources.find((r) => r.title === title);
    if (resource) {
      setId(resource._id); /* eslint no-underscore-dangle: 0 */
      setDescription(resource.description);
      setLink(resource.link);
      setType(resource.type);
    }
  }, [title, resources]);

  const handleSubmit = () => {
    if (!title || !description || !link || !type) {
      return;
    }
    editResource(id, title, description, link, type);
    setOpen(false);
  };

  const selectOptions = useMemo(
    () =>
      resources.map((resource) => (
        <MenuItem value={resource.title} key={resource._id}>
          {resource.title}
        </MenuItem>
      )),
    [resources],
  );
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
      <DialogTitle sx={{ textAlign: 'center' }}>Edit Entry</DialogTitle>
      <DialogActions
        sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}
      >
        <Stack spacing={2} sx={{ paddingBottom: '2rem' }}>
          <FormControl
            variant="outlined"
            sx={{
              marginRight: theme.spacing(2),
            }}
          >
            <InputLabel htmlFor="title-field">Title</InputLabel>
            <Select
              id="title-field"
              label="Title"
              value={title}
              sx={{
                minWidth: 150,
              }}
              onChange={(event) => setTitle(event.target.value)}
            >
              {selectOptions}
            </Select>
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

export default EditResourceDialog;