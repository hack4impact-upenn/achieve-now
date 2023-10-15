import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import React, { useState } from 'react';
import LoadingButton from './LoadingButton';
import { changeOtherRole } from '../../AdminDashboard/api';
import { useAppDispatch, useAppSelector } from '../../util/redux/hooks';
import { changeRole, selectUser } from '../../util/redux/userSlice';
import { selfChange } from '../../Home/api';

interface RoleDropdownProps {
  currRole: string;
  email: string;
  updateFE?: (email: string, role: string) => void;
}

function RoleDropdown({ currRole, email, updateFE }: RoleDropdownProps) {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [role, setRole] = useState(currRole);
  const [isLoading, setLoading] = useState(false);

  async function handleChange(newRole: string): Promise<void> {
    setLoading(true);
    if (user.email === email) {
      if (await selfChange(user.email as string, newRole)) {
        dispatch(changeRole({ role: newRole }));
        setRole(newRole);
        if (updateFE) {
          updateFE(email, newRole);
        }
      }
    } else if (await changeOtherRole(email, newRole)) {
      setRole(newRole);
      if (updateFE) {
        updateFE(email, newRole);
      }
    }
    setLoading(false);
  }

  if (isLoading) {
    return <LoadingButton />;
  }

  return (
    <FormControl variant="standard" sx={{ mb: 4 }} fullWidth>
      <InputLabel id="role">Role</InputLabel>
      <Select
        value={role}
        onChange={(e) => handleChange(e.target.value as string)}
        label="Role"
        labelId="role"
      >
        <MenuItem value="family">Family</MenuItem>
        <MenuItem value="coach">Coach</MenuItem>
        <MenuItem value="teacher">Teacher</MenuItem>
        <MenuItem value="admin">Admin</MenuItem>
      </Select>
    </FormControl>
  );
}

export default RoleDropdown;
