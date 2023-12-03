import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import AlertType from '../../util/types/alert';
import useAlert from '../../util/hooks/useAlert';
import { postData } from '../../util/api';

function InviteUserButton() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { setAlert } = useAlert();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setRole('');
    setError('');
  };

  const handleInvite = async () => {
    setLoading(true);
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

  const handleChange = (event: SelectChangeEvent) => {
    setError('');
    setRole(event.target.value);
  };

  const updateEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setEmail(event.target.value);
  };

  return (
    <div style={{ marginBottom: '10px' }}>
      <Button variant="contained" onClick={handleClickOpen}>
        Invite User
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <DialogContentText>
            Please enter one or more email addresses separated by commas and
            role of the user you would like to invite. (ex. a@gmail.com,
            b@outlook.com)
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
          <FormControl variant="standard" sx={{ mt: 1 }} fullWidth>
            <InputLabel id="role">Role</InputLabel>
            <Select
              value={role}
              onChange={handleChange}
              label="Role"
              labelId="role"
            >
              <MenuItem value="parent">Student</MenuItem>
              <MenuItem value="coach">Coach</MenuItem>
              <MenuItem value="teacher">Teacher</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
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

export default InviteUserButton;
