import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import AlertType from '../util/types/alert';
import useAlert from '../util/hooks/useAlert';
import { postData, useData } from '../util/api';

function EditLessonButton() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [number, setNumber] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { setAlert } = useAlert();

  const handleClickOpen = async () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError('');
  };

  const handleAddLesson = async () => {
    setLoading(true);
    postData('lesson/editLesson', { number, title }).then((res) => {
      if (res.error) {
        setError(res.error.message);
      } else {
        setAlert(`Lesson: ${title} successfully edited!`, AlertType.SUCCESS);
        setOpen(false);
        window.location.reload();
      }
      setLoading(false);
    });
  };

  const updateTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setTitle(event.target.value);
  };

  const updateNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const returnNumber = parseInt(
      event.target.value.substring(event.target.value.length - 1),
      10,
    );
    setNumber(returnNumber);
  };

  return (
    <div style={{ marginBottom: '10px' }}>
      <Button variant="outlined" onClick={handleClickOpen}>
        Edit
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <DialogContentText>
            Please enter the number of the lesson and title you want to edit.
          </DialogContentText>
          <TextField
            autoFocus
            sx={{ mt: 1 }}
            defaultValue={1}
            id="name"
            label="Lesson Number"
            type="number"
            fullWidth
            variant="standard"
            onChange={updateNumber}
          />
          <TextField
            autoFocus
            sx={{ mt: 1 }}
            id="name"
            label="Edit Title"
            type="title"
            fullWidth
            variant="standard"
            onChange={updateTitle}
          />
          <DialogContentText sx={{ color: 'red' }}>{error}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button disabled={loading} onClick={handleClose}>
            Cancel
          </Button>
          <Button disabled={loading} onClick={handleAddLesson}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default EditLessonButton;
