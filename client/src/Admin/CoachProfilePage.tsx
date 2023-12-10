import {
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getData, postData, putData, useData } from '../util/api';
import AlertDialog from '../components/AlertDialog';
import PrimaryButton from '../components/buttons/PrimaryButton';
import { InputErrorMessage } from '../util/inputvalidation';
import useAlert from '../util/hooks/useAlert';
import AlertType from '../util/types/alert';
import Header from '../components/PageHeader';
import ICoach from '../util/types/coach';
import IUser from '../util/types/user';

function CoachProfilePage() {
  const { setAlert } = useAlert();
  const { id } = useParams();
  // Default values for state
  const defaultValues = {
    partnerSite: '',
    phone: '',
    email: '',
    mailingAddress: '',
    mediaWaiver: '',
    updates: '',
  };

  const defaultShowErrors = {
    partnerSite: false,
    phone: false,
    email: false,
    mailingAddress: false,
    mediaWaiver: false,
    updates: false,
    alert: false,
  };

  const defaultErrorMessages = {
    partnerSite: '',
    phone: '',
    email: '',
    mailingAddress: '',
    mediaWaiver: '',
    updates: '',
    alert: '',
  };

  // Rest of your component code
  type ValueType = keyof typeof values;

  // State values and hooks
  const [values, setValueState] = useState(defaultValues);
  const [showError, setShowErrorState] = useState(defaultShowErrors);
  const [errorMessage, setErrorMessageState] = useState(defaultErrorMessages);
  const [coachName, setCoachName] = useState('');

  const [coach, setCoach] = useState<ICoach | null>(null);
  const [user, setUser] = useState<IUser | null>(null);

  const coachData = useData(`coach/${id}`);

  async function getUser(userId: string) {
    const res = await getData(`user/${userId}`);
    if (!res.error) {
      setUser(res.data);
    }
  }

  useEffect(() => {
    const rawCoachData = coachData?.data;
    if (rawCoachData) {
      setCoach(rawCoachData);
      if (rawCoachData.user_id && rawCoachData.user_id.length >= 1) {
        getUser(rawCoachData.user_id);
      }
    }
  }, [coachData]);

  useEffect(() => {
    if (coach && user) {
      const newValue = {
        partnerSite: coach.partner_site,
        phone: user.phone,
        email: user.email,
        mailingAddress: coach.mailing_address,
        mediaWaiver: coach.media_waiver.toString(),
        updates: coach.updates,
      };
      setCoachName(`${user.firstName} ${user.lastName}`);
      setValueState(newValue);
    }
  }, [coach, user]);

  // Helper functions for changing only one field in a state object
  const setValue = (field: string, value: string) => {
    setValueState((prevState: any) => ({
      ...prevState,
      ...{ [field]: value },
    }));
  };
  const setShowError = (field: string, show: boolean) => {
    setShowErrorState((prevState: any) => ({
      ...prevState,
      ...{ [field]: show },
    }));
  };
  const setErrorMessage = (field: string, msg: string) => {
    setErrorMessageState((prevState: any) => ({
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
      if (!values[valueType] && valueType !== 'updates') {
        setErrorMessage(valueTypeString, InputErrorMessage.MISSING_INPUT);
        setShowError(valueTypeString, true);
        isValid = false;
      }
    }

    return isValid;
  };

  async function handleSubmit() {
    if (validateInputs()) {
      if (!id) {
        setShowError('alert', true);
        setErrorMessage('alert', 'No user is defined');
        return;
      }
      const newUserValues = { email: values.email, phone: values.phone };
      const newUser = {
        ...user,
        ...newUserValues,
      };
      putData(`user/${coach?.user_id}`, newUser);

      const newCoachValues = {
        partner_site: values.partnerSite,
        mailing_address: values.mailingAddress,
        media_waiver: values.mediaWaiver,
        updates: values.updates,
      };
      const newCoach = {
        ...coach,
        ...newCoachValues,
      };
      putData(`coach/${id}`, newCoach)
        .then((res) => {
          if (res.error) {
            setShowError('alert', true);
            setErrorMessage('alert', res.error.message);
          } else {
            setAlert(
              'Student profile updated successfully!',
              AlertType.SUCCESS,
            );
          }
        })
        .catch((e: any) => {
          setShowError('alert', true);
          setErrorMessage('alert', e.message);
        });
    }
  }

  return (
    <>
      <Header />
      <Grid
        container
        direction="column"
        justifyContent="center"
        width="0.4"
        spacing={2}
        mx="auto"
        my={4}
      >
        <Grid item container justifyContent="center">
          <Typography variant="h2" mb={0}>
            {coachName} (Coach)
          </Typography>
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            error={showError.partnerSite}
            helperText={errorMessage.partnerSite}
            required
            label="Partner Site"
            value={values.partnerSite}
            onChange={(e) => setValue('partnerSite', e.target.value)}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            error={showError.phone}
            helperText={errorMessage.phone}
            required
            label="Phone Number"
            value={values.phone}
            type="phone"
            onChange={(e) => setValue('phone', e.target.value)}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            error={showError.email}
            helperText={errorMessage.email}
            required
            label="Email"
            value={values.email}
            type="email"
            onChange={(e) => setValue('email', e.target.value)}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            error={showError.mailingAddress}
            helperText={errorMessage.mailingAddress}
            required
            label="Mailing Address"
            value={values.mailingAddress}
            onChange={(e) => setValue('mailingAddress', e.target.value)}
          />
        </Grid>

        <Grid item width="1">
          <FormControl fullWidth>
            <InputLabel>Media Waiver</InputLabel>
            <Select
              fullWidth
              error={showError.mediaWaiver}
              //   helperText={errorMessage.contactMethod}
              required
              label="Media Waiver"
              value={values.mediaWaiver}
              onChange={(e) => setValue('mediaWaiver', e.target.value)}
            >
              <MenuItem value="true">Complete</MenuItem>
              <MenuItem value="false">Incomplete</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item width="1">
          <TextField
            fullWidth
            error={showError.updates}
            helperText={errorMessage.updates}
            label="Notes / Updates"
            value={values.updates}
            onChange={(e) => setValue('updates', e.target.value)}
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
    </>
  );
}

export default CoachProfilePage;
