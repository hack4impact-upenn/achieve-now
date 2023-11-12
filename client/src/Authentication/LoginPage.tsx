import React, { useState } from 'react';
import { TextField, Link, Grid } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAppDispatch } from '../util/redux/hooks';
import { login as loginRedux } from '../util/redux/userSlice';
import FormGrid from '../components/form/FormGrid';
import FormCol from '../components/form/FormCol';
import FormRow from '../components/form/FormRow';
import { emailRegex, InputErrorMessage } from '../util/inputvalidation';
import { loginUser } from './api';
import AlertDialog from '../components/AlertDialog';
import PrimaryButton from '../components/buttons/PrimaryButton';
import ScreenGrid from '../components/ScreenGrid';
import AchieveLogo from '../assets/achieve-now-logo.png';
import Attendance from '../StudentProgress/Attendance';

/**
 * A page allowing users to input their email and password to login. The default
 * starting page of the application
 */
function LoginPage() {
  const navigate = useNavigate();

  // Default values for state
  const defaultValues = {
    email: '',
    password: '',
  };
  const defaultShowErrors = {
    email: false,
    password: false,
    alert: false,
  };
  const defaultErrorMessages = {
    email: '',
    password: '',
    alert: '',
  };
  type ValueType = keyof typeof values;

  // State values and hooks
  const [values, setValueState] = useState(defaultValues);
  const [showError, setShowErrorState] = useState(defaultShowErrors);
  const [errorMessage, setErrorMessageState] = useState(defaultErrorMessages);

  // Helper functions for changing only one field in a state object
  const setValue = (field: string, value: string) => {
    setValueState((prevState) => ({
      ...prevState,
      ...{ [field]: value },
    }));
  };
  const setShowError = (field: string, show: boolean) => {
    setShowErrorState((prevState) => ({
      ...prevState,
      ...{ [field]: show },
    }));
  };
  const setErrorMessage = (field: string, msg: string) => {
    setErrorMessageState((prevState) => ({
      ...prevState,
      ...{ [field]: msg },
    }));
  };

  const alertTitle = 'Error';
  const handleAlertClose = () => {
    setShowError('alert', false);
  };

  const dispatch = useAppDispatch();
  function dispatchUser(
    userEmail: string,
    firstName: string,
    lastName: string,
    role: string,
    isOnboarded: boolean,
  ) {
    dispatch(
      loginRedux({ email: userEmail, firstName, lastName, role, isOnboarded }),
    );
  }

  const clearErrorMessages = () => {
    setShowErrorState(defaultShowErrors);
    setErrorMessageState(defaultErrorMessages);
  };

  const validateInputs = () => {
    clearErrorMessages();
    let isValid = true;

    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const valueTypeString in values) {
      const valueType = valueTypeString as ValueType;
      if (!values[valueType]) {
        setErrorMessage(valueTypeString, InputErrorMessage.MISSING_INPUT);
        setShowError(valueTypeString, true);
        isValid = false;
      }
    }

    if (!values.email.match(emailRegex)) {
      setErrorMessage('email', InputErrorMessage.INVALID_EMAIL);
      setShowError('email', true);
      isValid = false;
    }
    if (!values.password) {
      setErrorMessage('password', InputErrorMessage.MISSING_INPUT);
      setShowError('password', true);
      isValid = false;
    }

    return isValid;
  };

  async function handleSubmit() {
    if (validateInputs()) {
      loginUser(values.email, values.password)
        .then((user) => {
          const isOnboarded = user.firstName !== '' && user.lastName !== '';
          dispatchUser(
            user.email || null,
            user.firstName || null,
            user.lastName || null,
            user.role || null,
            isOnboarded,
          );
          if (isOnboarded) {
            navigate('/home');
          } else if (user.role === 'student') {
            navigate('/onboarding/student');
          }
        })
        .catch((e) => {
          setShowError('alert', true);
          setErrorMessage('alert', e.message);
        });
    }
  }

  return (
    <ScreenGrid>
      <FormGrid>
        <FormCol>
          <Grid item container justifyContent="center">
            <img width="50%" src={AchieveLogo} alt="Achieve Now Logo" />
          </Grid>
          <Grid item width="1">
            <TextField
              fullWidth
              error={showError.email}
              helperText={errorMessage.email}
              type="email"
              required
              label="Email"
              value={values.email}
              onChange={(e) => setValue('email', e.target.value)}
            />
          </Grid>
          <Grid item width="1">
            <TextField
              fullWidth
              error={showError.password}
              helperText={errorMessage.password}
              type="password"
              required
              label="Password"
              value={values.password}
              onChange={(e) => setValue('password', e.target.value)}
            />
          </Grid>
          <Grid item container justifyContent="center">
            <PrimaryButton
              fullWidth
              type="submit"
              variant="contained"
              onClick={() => handleSubmit()}
            >
              Login
            </PrimaryButton>
          </Grid>
          <FormRow>
            <Grid item>
              <Link component={RouterLink} to="/email-reset">
                Forgot password?
              </Link>
            </Grid>
            {/*  removed the signup link */}
          </FormRow>
        </FormCol>
      </FormGrid>
      {/* The alert that pops up */}
      <Grid item>
        <AlertDialog
          showAlert={showError.alert}
          title={alertTitle}
          message={errorMessage.alert}
          onClose={handleAlertClose}
        />
      </Grid>
    </ScreenGrid>
  );
}

export default LoginPage;
