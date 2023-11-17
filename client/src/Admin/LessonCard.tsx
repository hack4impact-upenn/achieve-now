import { Card, CardActionArea, CardContent, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LessonCardFromObjProps {
  lessonObj: any;
}

function LessonCardFromObj({ lessonObj }: LessonCardFromObjProps) {
  const navigate = useNavigate();
  // eslint-disable-next-line no-underscore-dangle
  const lessonID = lessonObj._id;

  function handleClick() {
    const s = `/resources/lesson/${lessonID}`;
    navigate(s);
  }

  return (
    <Card sx={{ p: 0.1, bgcolor: '#EDEDED', mb: 1, borderRadius: '8px' }}>
      <CardActionArea onClick={() => handleClick()}>
        <CardContent>
          <Typography variant="body1">Lesson {lessonObj.number}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default LessonCardFromObj;
