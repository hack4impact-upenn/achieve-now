import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { Typography, Grid } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../util/redux/hooks';
import {
  logout as logoutAction,
  changeRole,
  selectUser,
} from '../util/redux/userSlice';
import { logout as logoutApi, selfChange } from './api';
import ScreenGrid from '../components/ScreenGrid';
import PrimaryButton from '../components/buttons/PrimaryButton';

interface ChooseRoleProps {
  role: string | null;
  handleSelfChange: () => void;
  navigator: NavigateFunction;
}

/**
 * A button which, when clicked, will promote the user to admin. If the user is already admin, the button will be a link to the admin dashboard.
 * @param admin - a boolean indicating whether the user is an admin
 * @param handleSelfChange - a function which changes the user's role
 * @param navigator - a function which navigates to a new page (passed in from parent function)
 */
function PromoteButton({ role, handleSelfChange, navigator }: ChooseRoleProps) {
  if (role === null) {
    return null;
  }
  // return !admin ? (
  //   <PrimaryButton variant="contained" onClick={handleSelfPromote}>
  //     Promote self to admin
  //   </PrimaryButton>
  // ) : (
  //   <PrimaryButton
  //     variant="contained"
  //     onClick={() => navigator('/users', { replace: true })}
  //   >
  //     View all users
  //   </PrimaryButton>
  // );
}
/**
 * The HomePage of the user dashboard. Displays a welcome message, a logout button and a button to promote the user to admin if they are not already an admin. If the user is an admin, the button will navigate them to the admin dashboard. This utilizes redux to access the current user's information.
 */
function HomePage() {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const navigator = useNavigate();
  const [role, setRole] = useState(user.role);
  const logoutDispatch = () => dispatch(logoutAction());
  const handleLogout = async () => {
    if (await logoutApi()) {
      logoutDispatch();
      navigator('/login', { replace: true });
    }
  };

  // const handleSelfChange = async (newRole: string) => {
  //   const res = await selfChange(user.email as string, newRole);
  //   if (res) {
  //     dispatch(changeRole(newRole));
  //     setRole(newRole);
  //   }
  // };

  const message = `Welcome to the Boilerplate, ${user.firstName} ${user.lastName}!`;
  return (
    <ScreenGrid>
      <Typography variant="h2">{message}</Typography>
      <Grid item container justifyContent="center">
        {/* <PromoteButton
          admin={admin}
          handleSelfPromote={handleSelfPromote}
          navigator={navigator}
        /> */}
      </Grid>
      <Grid item container justifyContent="center">
        <Button onClick={handleLogout}>Logout</Button>
      </Grid>
    </ScreenGrid>
  );
}

export default HomePage;
