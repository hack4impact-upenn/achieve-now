import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { SelectChangeEvent } from '@mui/material/Select';
import AlertType from '../../util/types/alert';
import useAlert from '../../util/hooks/useAlert';
import { postData } from '../../util/api';

function InviteStudentButton() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
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

  const handleInvite = async () => {
    setLoading(true);
    const role = 'parent';
    postData('admin/invite', { email, role }).then((res) => {
      if (res.error) {
        setError(res.error.message);
      } else {
        setAlert(`${email} successfully invited!`, AlertType.SUCCESS);
        setOpen(false);
      }
      setLoading(false);
    });
  };

  const updateEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setEmail(event.target.value);
  };

  return (
    <div style={{ marginBottom: '10px' }}>
      <Button variant="contained" onClick={handleClickOpen}>
        Invite Student
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <DialogContentText>
            Please enter the email address of the student you would like to
            invite.
          </DialogContentText>
          <TextField
            autoFocus
            sx={{ mt: 1 }}
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            onChange={updateEmail}
          />
          <DialogContentText sx={{ color: 'red' }}>{error}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button disabled={loading} onClick={handleClose}>
            Cancel
          </Button>
          <Button disabled={loading} onClick={handleInvite}>
            Invite
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default InviteStudentButton;
