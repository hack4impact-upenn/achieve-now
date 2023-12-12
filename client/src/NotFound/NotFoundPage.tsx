/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { Typography, Button, Grid } from '@mui/material';
import ScreenGrid from '../components/ScreenGrid';
import { useAppDispatch, useAppSelector } from '../util/redux/hooks';
import { selectUser, logout as logoutAction } from '../util/redux/userSlice';
/**
 * A page for showing a 404 error to the user and offering a rediect to the
 * the home page.
 */
interface LinkButtonProps {
  role: string;
}
function LinkButton(props: LinkButtonProps): JSX.Element {
  if (props.role === 'admin') {
    return (
      <Button href="/admin-menu" variant="text">
        Go to admin menu
      </Button>
    );
  }
  if (props.role === 'coach') {
    return (
      <Button href="/coach-landing" variant="text">
        Go to coach landing page
      </Button>
    );
  }
  if (props.role === 'teacher') {
    return (
      <Button href="/teacher" variant="text">
        Go to teacher landing page
      </Button>
    );
  }
  if (props.role === 'student') {
    return (
      <Button href="/student-dashboard" variant="text">
        Go to student dashboard
      </Button>
    );
  }
  if (props.role === 'parent') {
    return (
      <Button href="/lessons" variant="text">
        Go to parent landing page
      </Button>
    );
  }
  return (
    <Button href="/home" variant="text">
      Go to home page
    </Button>
  );
}
function NotFoundPage() {
  const user = useAppSelector(selectUser);
  let role = '';
  if (user.role) {
    role = user.role;
  }
  return (
    <ScreenGrid>
      <Grid item>
        <Typography variant="h1">404</Typography>
      </Grid>
      <Grid item>
        <Typography>
          The page you&apos;re looking for doesn&apos;t exist
        </Typography>
      </Grid>
      <Grid item>
        {role !== '' ? (
          <LinkButton role={role} />
        ) : (
          <Button href="/home" variant="text">
            Go to home page
          </Button>
        )}
      </Grid>
    </ScreenGrid>
  );
}

export default NotFoundPage;
