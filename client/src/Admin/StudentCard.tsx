/* eslint-disable react/jsx-no-bind */
import { CardActionArea, CardContent, Typography, Card } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../util/api';

type StudentCardProps = {
  studentID: string;
  lesson: string;
};

function StudentCardFromID({ studentID, lesson }: StudentCardProps) {
  const navigate = useNavigate();

  const user = useData(`user/${studentID}`);
  let label = 'Name';
  if (user) {
    const info = user.data;
    const name = `${info?.firstName} ${info?.lastName}`;
    label = name;
  }

  function handleClick() {
    const s = `/student-progress/${studentID}`;
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

interface StudentCardFromObjProps {
  studentObj: any;
}

function StudentCardFromObj({ studentObj }: StudentCardFromObjProps) {
  const navigate = useNavigate();
  const studentID = studentObj.studentId;
  const label = `${studentObj.firstName} ${studentObj.lastName}`;

  function handleClick() {
    const s = `/student-progress/${studentID}`;
    navigate(s);
  }

  return (
    <Card sx={{ p: 0.1, bgcolor: '#EDEDED', mb: 1, borderRadius: '8px' }}>
      <CardActionArea onClick={handleClick}>
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            '@media (max-width: 150px)': {
              flexDirection: 'column',
            },
          }}
        >
          <Typography variant="body1">{label}</Typography>
          <Typography
            sx={{
              color: '#0175C0',
              display: 'flex',
              alignItems: 'center',
            }}
            variant="subtitle1"
          >
            <i>
              {studentObj.lessonNumber
                ? `Lesson ${studentObj.lessonNumber}`
                : ''}
            </i>
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export { StudentCardFromID, StudentCardFromObj };
