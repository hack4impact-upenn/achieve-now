import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import { useData } from '../util/api';

interface UpdateProps {
  userId: string;
}
function UpdatesComponent({ userId }: UpdateProps) {
  const currStudent = useData(`/student/${userId}`);
  if (currStudent?.data) {
    return (
      <Card sx={{ backgroundColor: 'white', borderColor: '1px black' }}>
        {currStudent.data.updates}
      </Card>
    );
  }
  return <Card />;
}

export default UpdatesComponent;
