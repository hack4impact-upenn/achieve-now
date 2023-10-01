import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { deleteUser } from './api';
import AlertType from '../util/types/alert';
import useAlert from '../util/hooks/useAlert';
import LoadingButton from '../components/buttons/LoadingButton';

interface TimeSlotCardProps {
  time: string;
  blocks: number[];
}

function TimeSlotCard({ time, blocks }: TimeSlotCardProps) {
  const [isLoading, setLoading] = useState(false);
  if (isLoading) {
    return <LoadingButton />;
  }
  return (
    <Card
      sx={{ maxWidth: 275, minHeight: 300 }}
      style={{ backgroundColor: 'gray' }}
    >
      <CardContent>
        <Typography sx={{ fontSize: 14 }} gutterBottom>
          {time}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default TimeSlotCard;
