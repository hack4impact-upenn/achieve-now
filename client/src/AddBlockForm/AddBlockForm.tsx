import React, { useState } from 'react';
import {
  Typography,
  Grid,
  TextField,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import ScreenGrid from '../components/ScreenGrid';
import FormGrid from '../components/form/FormGrid';
import FormCol from '../components/form/FormCol';
import PrimaryButton from '../components/buttons/PrimaryButton';

/**
 * A page only accessible to admins that displays all users in a table and allows
 * Admin to delete users from admin and promote users to admin.
 */
function AddBlockForm() {
  const [day, setDay] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [blockNumber, setBlockNumber] = useState('');
  const [zoom, setZoom] = useState('');
  const [pairs, setPairs] = useState([]);

  const handleDayChange = (event: SelectChangeEvent) => {
    setDay(event.target.value as string);
  };

  const handleStartTimeChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setStartTime(event.target.value as string);
  };

  const handleEndTimeChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    console.log(endTime);
    setEndTime(event.target.value as string);
  };

  const handleBlockNumberChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setBlockNumber(event.target.value as string);
  };

  const handleZoomChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setZoom(event.target.value as string);
  };

  return (
    <ScreenGrid>
      <Typography variant="h4">Add Block</Typography>
      <FormGrid>
        <FormCol>
          <Grid item width="1">
            <Typography variant="subtitle1">Day</Typography>
            <Select
              value={day}
              label="Day"
              fullWidth
              onChange={handleDayChange}
            >
              <MenuItem value="Sunday">Sunday</MenuItem>
              <MenuItem value="Monday">Monday</MenuItem>
              <MenuItem value="Tuesday">Tuesday</MenuItem>
              <MenuItem value="Wednesday">Wednesday</MenuItem>
              <MenuItem value="Thursday">Thursday</MenuItem>
              <MenuItem value="Friday">Friday</MenuItem>
              <MenuItem value="Saturday">Saturday</MenuItem>
            </Select>
          </Grid>
          <Grid item width="1">
            <Typography variant="subtitle1">Start Time</Typography>
            <TextField
              fullWidth
              value={startTime}
              onChange={handleStartTimeChange}
              type="time"
              variant="standard"
              required
            />
          </Grid>
          <Grid item width="1">
            <Typography variant="subtitle1">End Time</Typography>
            <TextField
              fullWidth
              value={endTime}
              onChange={handleEndTimeChange}
              type="time"
              variant="standard"
              required
            />
          </Grid>
          <Grid item width="1">
            <TextField
              fullWidth
              value={blockNumber}
              onChange={handleBlockNumberChange}
              label="Block number"
              required
              variant="standard"
              placeholder="Block number"
            />
          </Grid>
          <Grid item width="1">
            <TextField
              fullWidth
              value={zoom}
              onChange={handleZoomChange}
              label="Zoom link"
              variant="standard"
              placeholder="Zoom link"
            />
          </Grid>
          <Grid item width="1">
            <Typography variant="h6">Pairs</Typography>
            <Select label="Coach" fullWidth>
              <MenuItem value="Coach 1">Coach 1</MenuItem>
            </Select>
            <Select label="Student" fullWidth>
              <MenuItem value="Student">Student 1</MenuItem>
            </Select>
          </Grid>
          <Grid item container justifyContent="center">
            <PrimaryButton type="submit" variant="contained">
              Submit
            </PrimaryButton>
          </Grid>
        </FormCol>
      </FormGrid>
    </ScreenGrid>
  );
}

export default AddBlockForm;
