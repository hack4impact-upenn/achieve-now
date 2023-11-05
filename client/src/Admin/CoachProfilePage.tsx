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
import { postData, useData } from '../util/api';
import AlertDialog from '../components/AlertDialog';
import PrimaryButton from '../components/buttons/PrimaryButton';
import { InputErrorMessage } from '../util/inputvalidation';
import Header from '../components/PageHeader';

function CoachProfilePage() {
  const { id } = useParams();

  // Default values for state
  const defaultValues = {
    school: '',
    partnerSite: '',
    grade: '',
    phone: '',
    email: '',
    mailingAddress: '',
    mediaWaiver: '',
    updates: '',
  };

  const defaultShowErrors = {
    school: false,
    partnerSite: false,
    grade: false,
    phone: false,
    email: false,
    mailingAddress: false,
    mediaWaiver: false,
    updates: false,
    alert: false,
  };

  const defaultErrorMessages = {
    school: '',
    partnerSite: '',
    grade: '',
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
  const [allPartnerSites, setAllPartnerSites] = useState([]);
  const [allSchools, setAllSchoolsState] = useState([]);
  const [coachName, setCoachName] = useState('');

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
      if (!id) {
        setShowError('alert', true);
        setErrorMessage('alert', 'No user is defined');
        return;
      }
      postData(`coach/allInfo/${id}`, { values })
        .then(() => {
          setShowError('alert', true);
          setErrorMessage('alert', 'Successfully updated!');
        })
        .catch((e: any) => {
          setShowError('alert', true);
          setErrorMessage('alert', e.message);
        });
    }
  }

  const info = useData(`coach/allInfo/${id}`);
  const partnerSiteInfo = useData(`partnerSite/all`);
  const schoolInfo = useData(`school/all`);

  useEffect(() => {
    const infoData = info?.data;
    if (!infoData) {
      return;
    }
    const partnerSiteData = partnerSiteInfo?.data;
    if (!partnerSiteData) {
      return;
    }
    const schoolData = schoolInfo?.data;
    if (!schoolData) {
      return;
    }

    const { coach, user, student } = infoData;
    const newValue = {
      school: user.school_id,
      partnerSite: coach.partner_site,
      grade: student.grade,
      phone: user.phone,
      email: user.email,
      mailingAddress: coach.mailing_address,
      mediaWaiver: coach.media_waiver,
      updates: coach.updates,
    };

    const newPartnerSites = partnerSiteData.map((partnerSiteObj: any) => {
      return {
        id: partnerSiteObj.id,
        partnerSiteName: partnerSiteObj.siteName,
      };
    });

    const newSchools = schoolData.map((schoolObj: any) => {
      return {
        id: schoolObj.id,
        name: schoolObj.name,
      };
    });

    setValueState(newValue);
    setAllSchoolsState(newSchools);
    setAllPartnerSites(newPartnerSites);
  }, [info?.data, partnerSiteInfo?.data, schoolInfo?.data]);

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
        <Grid item width="1">
          <FormControl fullWidth>
            <InputLabel>School</InputLabel>
            <Select
              fullWidth
              error={showError.school}
              //   helperText={errorMessage.contactMethod}
              required
              label="School"
              value={values.school}
              onChange={(e) => setValue('School', e.target.value)}
            >
              {allSchools.map((school: any) => {
                return <MenuItem value={school.id}>{school.number}</MenuItem>;
              })}
            </Select>
          </FormControl>
        </Grid>

        <Grid item width="1">
          <FormControl fullWidth>
            <InputLabel>Partner Site</InputLabel>
            <Select
              fullWidth
              error={showError.partnerSite}
              //   helperText={errorMessage.contactMethod}
              required
              label="Partner Site"
              value={values.partnerSite}
              onChange={(e) => setValue('Partner Site', e.target.value)}
            >
              {allPartnerSites.map((teacher: any) => {
                return (
                  <MenuItem
                    value={teacher.id}
                  >{`${teacher.firstName} ${teacher.lastName}`}</MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>

        <Grid item width="1">
          <FormControl fullWidth>
            <InputLabel>Grade</InputLabel>
            <Select
              fullWidth
              error={showError.grade}
              //   helperText={errorMessage.contactMethod}
              required
              label="Lesson Level"
              value={values.grade}
              onChange={(e) => setValue('lessonLevel', e.target.value)}
            >
              {allSchools.map((lesson: any) => {
                return <MenuItem value={lesson.id}>{lesson.number}</MenuItem>;
              })}
            </Select>
          </FormControl>
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
            onChange={(e) => setValue('mailing address', e.target.value)}
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
            required
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
