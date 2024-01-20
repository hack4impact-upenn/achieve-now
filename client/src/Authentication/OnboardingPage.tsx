import React, { useState } from 'react';
import {
  TextField,
  Grid,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../util/redux/hooks';
import { selectUser } from '../util/redux/userSlice';
import PrimaryButton from '../components/buttons/PrimaryButton';
import AlertDialog from '../components/AlertDialog';
import { onboardStudent } from './api';
import { InputErrorMessage } from '../util/inputvalidation';

function OnboardingPage() {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  // Default values for state
  const defaultValues = {
    studentFirst: '',
    studentLast: '',
    parentName: '',
    parentPhone: '',
    contactMethod: '',
    bestDay: '',
    bestTime: '',
    studentInterests: '',
  };
  const defaultShowErrors = {
    studentFirst: false,
    studentLast: false,
    parentName: false,
    parentPhone: false,
    contactMethod: false,
    bestDay: false,
    bestTime: false,
    studentInterests: false,
    alert: false,
  };
  const defaultErrorMessages = {
    studentFirst: '',
    studentLast: '',
    parentName: '',
    parentPhone: '',
    contactMethod: '',
    bestDay: '',
    bestTime: '',
    studentInterests: '',
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

    return isValid;
  };

  async function handleSubmit() {
    if (validateInputs()) {
      if (user.email === null) {
        setShowError('alert', true);
        setErrorMessage('alert', 'User email is null');
        return;
      }
      onboardStudent(values, user.email)
        .then(() => {
          navigate('/login');
        })
        .catch((e: any) => {
          setShowError('alert', true);
          setErrorMessage('alert', e.message);
        });
    }
  }

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      width="0.4"
      spacing={2}
      mx="auto"
      my={4}
    >
      <Grid item container justifyContent="center" direction="column">
        <Typography variant="h2" align="center" marginBottom={0}>
          Welcome!
        </Typography>
        <Typography variant="subtitle1" align="center">
          Please fill out the following information to complete your account.
        </Typography>
      </Grid>
      <Grid container item width="1">
        <Grid item xs={5.75}>
          <TextField
            fullWidth
            error={showError.studentFirst}
            helperText={errorMessage.studentFirst}
            required
            label="Student First Name"
            value={values.studentFirst}
            onChange={(e) => setValue('studentFirst', e.target.value)}
          />
        </Grid>
        <Grid item xs={0.5} />
        <Grid item xs={5.75}>
          <TextField
            fullWidth
            error={showError.studentLast}
            helperText={errorMessage.studentLast}
            required
            label="Student Last Name"
            value={values.studentLast}
            onChange={(e) => setValue('studentLast', e.target.value)}
          />
        </Grid>
      </Grid>
      <Grid item width="1" spacing={1}>
        <TextField
          fullWidth
          error={showError.parentName}
          helperText={errorMessage.parentName}
          required
          label="Parent Full Name"
          value={values.parentName}
          onChange={(e) => setValue('parentName', e.target.value)}
        />
      </Grid>
      <Grid item width="1" spacing={1}>
        <TextField
          fullWidth
          error={showError.parentPhone}
          helperText={errorMessage.parentPhone}
          type="phone"
          required
          label="Parent Phone"
          value={values.parentPhone}
          onChange={(e) => setValue('parentPhone', e.target.value)}
        />
      </Grid>
      <Grid item width="1" spacing={1}>
        <FormControl fullWidth>
          <InputLabel>Preferred Contact Method</InputLabel>
          <Select
            fullWidth
            error={showError.contactMethod}
            //   helperText={errorMessage.contactMethod}
            required
            label="Preferred Contact Method"
            value={values.contactMethod}
            onChange={(e) => setValue('contactMethod', e.target.value)}
          >
            <MenuItem value="email">Email</MenuItem>
            <MenuItem value="phone">Phone</MenuItem>
            <MenuItem value="text">Text</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid container item width="1">
        <Grid item xs={5.75}>
          <FormControl fullWidth>
            <InputLabel>Best Days to Contact</InputLabel>
            <Select
              error={showError.bestDay}
              //   helperText={errorMessage.bestDay}
              required
              label="Best Days to Contact"
              value={values.bestDay}
              onChange={(e) => setValue('bestDay', e.target.value)}
            >
              <MenuItem value="weekends">Weekends</MenuItem>
              <MenuItem value="weekdays">Weekdays</MenuItem>
              <MenuItem value="any">Any</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={0.5} />
        <Grid item xs={5.75}>
          <FormControl fullWidth>
            <InputLabel>Best Time to Contact</InputLabel>
            <Select
              error={showError.bestTime}
              //   helperText={errorMessage.bestTime}
              required
              label="Best Time to Contact"
              value={values.bestTime}
              onChange={(e) => setValue('bestTime', e.target.value)}
            >
              <MenuItem value="morning">Morning</MenuItem>
              <MenuItem value="afternoon">Afternoon</MenuItem>
              <MenuItem value="evening">Evening</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid item width="1">
        <TextField
          fullWidth
          error={showError.studentInterests}
          helperText={errorMessage.studentInterests}
          required
          label="Tell us about your child's interests"
          value={values.studentInterests}
          onChange={(e) => setValue('studentInterests', e.target.value)}
        />
      </Grid>
      <Grid item container justifyContent="center">
        <PrimaryButton
          fullWidth
          type="submit"
          variant="contained"
          onClick={() => handleSubmit()}
        >
          Submit
        </PrimaryButton>
      </Grid>
      {/* The alert that pops up */}
      <Grid item>
        <AlertDialog
          showAlert={showError.alert}
          title={alertTitle}
          message={errorMessage.alert}
          onClose={handleAlertClose}
        />
      </Grid>
    </Grid>
  );
}

export default OnboardingPage;
