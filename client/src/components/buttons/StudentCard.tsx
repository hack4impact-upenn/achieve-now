/* eslint-disable react/jsx-no-bind */
import { CardActionArea, CardContent, Typography, Card } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type StudentCardProps = {
  studentName: string;
  lesson: string;
};

function StudentCard({ studentName, lesson }: StudentCardProps) {
  const navigate = useNavigate();
  const label = studentName;

  function handleClick() {
    // const s = `/city-dashboard/${cityName}`;
    // navigate(s);
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
          >
            <b>
              <i>{lesson}</i>
            </b>
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default StudentCard;
