/* eslint-disable react/jsx-no-bind */
import { CardActionArea, CardContent, Typography, Card } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../util/api';

type LessonCardProps = {
  lessonID: string;
};

function LessonCard({ lessonID }: LessonCardProps) {
  const navigate = useNavigate();
  const lesson = useData(`lesson/${lessonID}`);
  let label = 'Lesson ';
  if (lesson) {
    const info = lesson.data;
    const number = `${info.number}`;
    label += '' + number;
  }

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
              <i>{label}</i>
            </b>
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default LessonCard;
