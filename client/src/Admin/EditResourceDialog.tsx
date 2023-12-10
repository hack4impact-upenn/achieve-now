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
import PrimaryButton from '../components/buttons/PrimaryButton';
import useAlert from '../util/hooks/useAlert';
import AlertType from '../util/types/alert';

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
  const { setAlert } = useAlert();
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
      if (resources[i].title === title && resources[i]._id !== id) {
        setAlert('A Resource with this title already exists', AlertType.ERROR);
        return;
      }
    }
    editResource(id, title, description, link, type);
    setAlert('Added resource successfully!', AlertType.SUCCESS);
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
          minWidth: '50vw',
        },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', fontSize: '18px' }}>
        Edit Entry
      </DialogTitle>
      <DialogActions
        sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}
      >
        <Stack spacing={2} sx={{ paddingBottom: '2rem', width: '100%' }}>
          <FormControl
            variant="outlined"
            sx={{
              marginRight: theme.spacing(1),
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
          <FormControl fullWidth>
            <InputLabel id="resource-type-label">Type</InputLabel>
            <Select
              fullWidth
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

export default EditResourceDialog;
