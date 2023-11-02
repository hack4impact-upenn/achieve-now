import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { Typography, Grid, Box } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../util/redux/hooks';
import { logout as logoutAction, selectUser } from '../util/redux/userSlice';
import { logout as logoutApi } from './api';
import ScreenGrid from '../components/ScreenGrid';
import PrimaryButton from '../components/buttons/PrimaryButton';
import RoleDropdown from '../components/buttons/RoleDropdown';
import Attendance from '../components/Attendance';

interface ChooseRoleProps {
  role: string | null;
  email: string;
  navigator: NavigateFunction;
}

/**
 * A dropdown which, when clicked, will allow the user to select their role. If the user is already admin, the button will be a link to the admin dashboard.
 * @param currRole - a string indicating whether the user's current role
 * @param email - the email of the user to change the role of (my email)
 * @param navigator - a function which navigates to a new page (passed in from parent function)
 */
function RoleSelect({ role, email, navigator }: ChooseRoleProps) {
  if (role === null) {
    return null;
  }
  return role !== 'admin' ? (
    <Box width={0.3}>
      <RoleDropdown currRole={role} email={email} />
    </Box>
  ) : (
    <PrimaryButton
      variant="contained"
      onClick={() => navigator('/users', { replace: true })}
    >
      View all users
    </PrimaryButton>
  );
}
/**
 * The HomePage of the user dashboard. Displays a welcome message, a logout button and a button to promote the user to admin if they are not already an admin. If the user is an admin, the button will navigate them to the admin dashboard. This utilizes redux to access the current user's information.
 */
function HomePage() {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const navigator = useNavigate();
  const logoutDispatch = () => dispatch(logoutAction());
  const handleLogout = async () => {
    if (await logoutApi()) {
      logoutDispatch();
      navigator('/login', { replace: true });
    }
  };

  const message = `Welcome to the Boilerplate, ${user.firstName} ${user.lastName}!`;
  return (
    <ScreenGrid>
      <Typography variant="h2">{message}</Typography>
      <Grid item container justifyContent="center">
        <RoleSelect
          role={user.role as string}
          email={user.email as string}
          navigator={navigator}
        />
      </Grid>
      <Grid item container justifyContent="center">
        <Button onClick={handleLogout}>Logout</Button>
      </Grid>
    </ScreenGrid>
  );
}

export default HomePage;
