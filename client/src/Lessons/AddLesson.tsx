import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import AlertType from '../util/types/alert';
import useAlert from '../util/hooks/useAlert';
import { postData } from '../util/api';

function AddLessonButton() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { setAlert } = useAlert();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError('');
  };

  const handleAddLesson = async () => {
    setLoading(true);
    postData('lesson/addLesson', { title }).then((res) => {
      if (res.error) {
        setError(res.error.message);
        setAlert(`Failed to Add Lesson`, AlertType.ERROR);
      } else {
        setAlert(`Lesson: ${title} successfully added!`, AlertType.SUCCESS);
        setOpen(false);
        window.location.reload();
      }
      setLoading(false);
    });
  };

  const updateLesson = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setTitle(event.target.value);
  };

  return (
    <div style={{ marginBottom: '10px' }}>
      <Button
        style={{ width: '100px' }}
        variant="outlined"
        onClick={handleClickOpen}
      >
        Add
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <DialogContentText>
            Please enter the title of the lesson.
          </DialogContentText>
          <TextField
            autoFocus
            sx={{ mt: 1 }}
            id="name"
            label="Lesson Title"
            type="title"
            fullWidth
            variant="standard"
            onChange={updateLesson}
          />
          <DialogContentText sx={{ color: 'red' }}>{error}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button disabled={loading} onClick={handleClose}>
            Cancel
          </Button>
          <Button disabled={loading} onClick={handleAddLesson}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AddLessonButton;
