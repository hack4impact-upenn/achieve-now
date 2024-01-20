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
        Go to Admin Menu
      </Button>
    );
  }
  if (props.role === 'coach') {
    return (
      <Button href="/coach-landing" variant="text">
        Go to Coach Landing Page
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
  if (props.role === 'parent') {
    return (
      <Button href="/student/lessons" variant="text">
        Go to Parent Home
      </Button>
    );
  }
  return (
    <Button href="/" variant="text">
      Go to Home Page
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
          <Button href="/login" variant="text">
            Login
          </Button>
        )}
      </Grid>
    </ScreenGrid>
  );
}

export default NotFoundPage;
