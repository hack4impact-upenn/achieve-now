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

function StudentProfilePage() {
  const { id } = useParams();

  // Default values for state
  const defaultValues = {
    school: '',
    teacher: '',
    lessonLevel: '',
    grade: '',
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
    badges: '',
  };

  const defaultShowErrors = {
    school: false,
    teacher: false,
    lessonLevel: false,
    grade: false,
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
    badges: false,
    alert: false,
  };

  const defaultErrorMessages = {
    school: '',
    teacher: '',
    lessonLevel: '',
    grade: '',
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
    badges: '',
    alert: '',
  };

  // Rest of your component code

  type ValueType = keyof typeof values;

  // State values and hooks
  const [values, setValueState] = useState(defaultValues);
  const [showError, setShowErrorState] = useState(defaultShowErrors);
  const [errorMessage, setErrorMessageState] = useState(defaultErrorMessages);
  const [allTeachers, setAllTeachersState] = useState([]);
  const [allLessons, setAllLessonsState] = useState([]);
  const [allSchools, setAllSchoolsState] = useState([]);
  const [studentName, setStudentNameState] = useState('');

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
      postData(`student/allInfo/${id}`, { values })
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

  const info = useData(`student/allInfo/${id}`);
  const lessonInfo = useData(`lesson/all`);
  const teacherInfo = useData(`user/allTeachers`);
  const schoolInfo = useData(`school/all`);

  useEffect(() => {
    const infoData = info?.data;
    if (!infoData) {
      return;
    }
    const lessonData = lessonInfo?.data;
    if (!lessonData) {
      return;
    }
    const teacherData = teacherInfo?.data;
    if (!teacherData) {
      return;
    }

    const schoolData = schoolInfo?.data;
    if (!schoolData) {
      return;
    }

    const { student, user, lesson } = infoData;
    const newValue = {
      school: student.school_id,
      teacher: student.teacher_id,
      lessonLevel: lesson.number,
      grade: student.grade,
      phone: user.phone,
      email: user.email,
      parentName: student.parent_name,
      bestDay: student.parent_communication_days,
      bestTime: student.parent_communication_times,
      contactMethod: student.best_communication_method,
      mediaWaiver: student.media_waiver,
      adminUpdates: student.admin_updates,
      workHabits: student.work_habits,
      personality: student.personality,
      family: student.family,
      favFood: student.fav_food,
      likes: student.likes,
      dislikes: student.dislikes,
      motivation: student.motivation,
      goodStrategies: student.good_strategies,
      badStrategies: student.bad_strategies,
      badges: student.badges,
    };
    const newLessons = lessonData.map((lessonObj: any) => {
      return {
        id: lessonObj.id,
        number: lessonObj.number,
      };
    });

    const newTeachers = teacherData.map((teacherObj: any) => {
      return {
        id: teacherObj.id,
        firstName: teacherObj.firstName,
        lastName: teacherObj.lastName,
      };
    });

    const newSchools = schoolData.map((schoolObj: any) => {
      return {
        id: schoolObj.id,
        name: schoolObj.name,
      };
    });

    setValueState(newValue);
    setAllLessonsState(newLessons);
    setAllTeachersState(newTeachers);
    setStudentNameState(`${user.firstName} ${user.lastName}`);
    setAllTeachersState(newTeachers);
  }, [info?.data, lessonInfo?.data, teacherInfo?.data, schoolInfo?.data]);

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
          {studentName} (Student)
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
            {allTeachers.map((teacher: any) => {
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
            {allLessons.map((lesson: any) => {
              return <MenuItem value={lesson.id}>{lesson.number}</MenuItem>;
            })}
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
            value={values.grade}
            onChange={(e) => setValue('lessonLevel', e.target.value)}
          >
            {Array.from(Array(12).keys()).map((num) => {
              return <MenuItem value={num + 1}>{num + 1}</MenuItem>;
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
          error={showError.badges}
          helperText={errorMessage.badges}
          required
          label="Badges"
          value={values.badges}
          onChange={(e) => setValue('badges', e.target.value)}
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

export default StudentProfilePage;
