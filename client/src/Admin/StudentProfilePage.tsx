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
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../util/redux/hooks';
import { selectUser } from '../util/redux/userSlice';
import { useData } from '../util/api';

function StudentProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);

  // Default values for state
  const defaultValues = {
    school: '',
    teacher: '',
    lessonLevel: '',
    phone: '',
    email: '',
    parentName: '',
    bestDay: '',
    bestTime: '',
    contactMethod: '',
    mediaWaiver: '',
    adminUpdates: '',
    workHabits: '',
    personality: '',
    family: '',
    favFood: '',
    likes: '',
    dislikes: '',
    motivation: '',
    goodStrategies: '',
    badStrategies: '',
    progressStats: '',
  };

  const defaultShowErrors = {
    school: false,
    teacher: false,
    lessonLevel: false,
    phone: false,
    email: false,
    parentName: false,
    bestDay: false,
    bestTime: false,
    contactMethod: false,
    mediaWaiver: false,
    adminUpdates: false,
    workHabits: false,
    personality: false,
    family: false,
    favFood: false,
    likes: false,
    dislikes: false,
    motivation: false,
    goodStrategies: false,
    badStrategies: false,
    progressStats: false,
  };

  const defaultErrorMessages = {
    school: '',
    teacher: '',
    lessonLevel: '',
    phone: '',
    email: '',
    parentName: '',
    bestDay: '',
    bestTime: '',
    contactMethod: '',
    mediaWaiver: '',
    adminUpdates: '',
    workHabits: '',
    personality: '',
    family: '',
    favFood: '',
    likes: '',
    dislikes: '',
    motivation: '',
    goodStrategies: '',
    badStrategies: '',
    progressStats: '',
  };

  // Rest of your component code

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

  const info = useData(`student/allInfo/${id}`);

  useEffect(() => {
    const infoData = info?.data;
    if (!infoData) {
      return;
    }
    const { student } = infoData;
    const newValue = {
      school: student.school,
      teacher: student.teacher,
      lessonLevel: student.lessonLevel,
      phone: student.phone,
      email: student.email,
      parentName: student.parentName,
      bestDay: student.bestDay,
      bestTime: student.bestTime,
      contactMethod: student.contactMethod,
      mediaWaiver: student.mediaWaiver,
      adminUpdates: student.adminUpdates,
      workHabits: student.workHabits,
      personality: student.personality,
      family: student.family,
      favFood: student.favFood,
      likes: student.likes,
      dislikes: student.dislikes,
      motivation: student.motivation,
      goodStrategies: student.goodStrategies,
      badStrategies: student.badStrategies,
      progressStats: student.progressStats,
    };
    setValueState(newValue);
  }, [info?.data]);

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
      <Grid item container justifyContent="center">
        <Typography variant="h2" mb={0}>
          Anna Bay (Student)
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
            <MenuItem value="School A">School</MenuItem>
            <MenuItem value="School B">School</MenuItem>
            <MenuItem value="School C">School</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item width="1">
        <FormControl fullWidth>
          <InputLabel>Teacher</InputLabel>
          <Select
            fullWidth
            error={showError.teacher}
            //   helperText={errorMessage.contactMethod}
            required
            label="Teacher"
            value={values.teacher}
            onChange={(e) => setValue('Teacher', e.target.value)}
          >
            <MenuItem value="Teacher A">Teacher</MenuItem>
            <MenuItem value="Teacher B">Teacher</MenuItem>
            <MenuItem value="Teacher C">Teacher</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item width="1">
        <FormControl fullWidth>
          <InputLabel>lessonLevel</InputLabel>
          <Select
            fullWidth
            error={showError.lessonLevel}
            //   helperText={errorMessage.contactMethod}
            required
            label="Lesson Level"
            value={values.lessonLevel}
            onChange={(e) => setValue('lessonLevel', e.target.value)}
          >
            <MenuItem value="1">lessonLevel</MenuItem>
            <MenuItem value="2">lessonLevel</MenuItem>
            <MenuItem value="3">lessonLevel</MenuItem>
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
          onChange={(e) => setValue('email', e.target.value)}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          error={showError.parentName}
          helperText={errorMessage.parentName}
          required
          label="Parent/Guardian Name"
          value={values.parentName}
          onChange={(e) => setValue('parentName', e.target.value)}
        />
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel>Best Days to Contact</InputLabel>
          <Select
            error={showError.bestDay}
            //   helperText={errorMessage.bestDay}
            required
            label="Parent/Guardian Communication Preferences Days"
            value={values.bestDay}
            onChange={(e) => setValue('bestDay', e.target.value)}
          >
            <MenuItem value="weekends">Weekends</MenuItem>
            <MenuItem value="weekdays">Weekdays</MenuItem>
            <MenuItem value="any">Any</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel>Best Time to Contact</InputLabel>
          <Select
            error={showError.bestTime}
            //   helperText={errorMessage.bestTime}
            required
            label="Parent/Guardian Communication Preferences Times"
            value={values.bestTime}
            onChange={(e) => setValue('bestTime', e.target.value)}
          >
            <MenuItem value="morning">Morning</MenuItem>
            <MenuItem value="afternoon">Afternoon</MenuItem>
            <MenuItem value="evening">Evening</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item width="1">
        <FormControl fullWidth>
          <InputLabel>Preferred Contact Method</InputLabel>
          <Select
            fullWidth
            error={showError.contactMethod}
            //   helperText={errorMessage.contactMethod}
            required
            label="Parent/Guardian Communication Preferences Methods"
            value={values.contactMethod}
            onChange={(e) => setValue('contactMethod', e.target.value)}
          >
            <MenuItem value="email">Email</MenuItem>
            <MenuItem value="phone">Phone</MenuItem>
            <MenuItem value="text">Text</MenuItem>
          </Select>
        </FormControl>
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
          error={showError.adminUpdates}
          helperText={errorMessage.adminUpdates}
          required
          label="Admin Updates"
          value={values.adminUpdates}
          onChange={(e) => setValue('adminUpdates', e.target.value)}
        />
      </Grid>
      <Grid item width="1">
        <TextField
          fullWidth
          error={showError.workHabits}
          helperText={errorMessage.workHabits}
          required
          label="Work Habits"
          value={values.workHabits}
          onChange={(e) => setValue('workHabits', e.target.value)}
        />
      </Grid>
      <Grid item width="1">
        <TextField
          fullWidth
          error={showError.personality}
          helperText={errorMessage.personality}
          required
          label="Personality & Interests"
          value={values.personality}
          onChange={(e) => setValue('personality', e.target.value)}
        />
      </Grid>
      <Grid item width="1">
        <TextField
          fullWidth
          error={showError.family}
          helperText={errorMessage.family}
          required
          label="Family"
          value={values.family}
          onChange={(e) => setValue('family', e.target.value)}
        />
      </Grid>
      <Grid item width="1">
        <TextField
          fullWidth
          error={showError.favFood}
          helperText={errorMessage.favFood}
          required
          label="Favorite Food"
          value={values.favFood}
          onChange={(e) => setValue('favFood', e.target.value)}
        />
      </Grid>
      <Grid item width="1">
        <TextField
          fullWidth
          error={showError.likes}
          helperText={errorMessage.likes}
          required
          label="Likes"
          value={values.likes}
          onChange={(e) => setValue('likes', e.target.value)}
        />
      </Grid>
      <Grid item width="1">
        <TextField
          fullWidth
          error={showError.dislikes}
          helperText={errorMessage.dislikes}
          required
          label="Dislikes"
          value={values.dislikes}
          onChange={(e) => setValue('dislikes', e.target.value)}
        />
      </Grid>
      <Grid item width="1">
        <TextField
          fullWidth
          error={showError.motivation}
          helperText={errorMessage.motivation}
          required
          label="What motivates them?"
          value={values.motivation}
          onChange={(e) => setValue('motivation', e.target.value)}
        />
      </Grid>
      <Grid item width="1">
        <TextField
          fullWidth
          error={showError.goodStrategies}
          helperText={errorMessage.goodStrategies}
          required
          label="What reading strategies worked?"
          value={values.goodStrategies}
          onChange={(e) => setValue('goodStrategies', e.target.value)}
        />
      </Grid>
      <Grid item width="1">
        <TextField
          fullWidth
          error={showError.badStrategies}
          helperText={errorMessage.badStrategies}
          required
          label="What reading strategies didn't work?"
          value={values.badStrategies}
          onChange={(e) => setValue('badStrategies', e.target.value)}
        />
      </Grid>
      <Grid item width="1">
        <TextField
          fullWidth
          error={showError.progressStats}
          helperText={errorMessage.progressStats}
          required
          label="Progress Stats"
          value={values.progressStats}
          onChange={(e) => setValue('progressStats', e.target.value)}
        />
      </Grid>
    </Grid>
  );
}

export default StudentProfilePage;
