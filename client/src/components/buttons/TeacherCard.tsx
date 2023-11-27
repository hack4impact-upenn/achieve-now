/* eslint-disable react/jsx-no-bind */
import { CardActionArea, CardContent, Typography, Card } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../util/api';

type StudentCardProps = {
  teacherID: string;
};

function TeacherCard({ teacherID }: StudentCardProps) {
  const navigate = useNavigate();
  const user = useData(`user/${teacherID}`);
  let label = 'Name';
  if (user) {
    const info = user.data;
    const name = `${info.firstName} ${info.lastName}`;
    label = name;
  }

  function handleClick() {
    const s = `/teacher/${teacherID}`;
    navigate(s);
  }

  return (
    <Card sx={{ p: 2, bgcolor: '#EDEDED', mb: 2, borderRadius: '8px' }}>
      <CardActionArea onClick={handleClick}>
        <CardContent>
          <Typography variant="h5">{label}</Typography>
          <Typography
            sx={{
              color: '#0175C0',
              display: 'flex',
              alignItems: 'center',
            }}
            variant="subtitle1"
          />
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default TeacherCard;
