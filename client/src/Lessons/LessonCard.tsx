import React from 'react';
import {
  Button,
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import { PlayCircleOutline } from '@mui/icons-material';
import theme from '../assets/theme';

interface IResource {
  id: string;
  title: string;
  description: string;
  type: string;
  link: string;
}

interface ICard extends IResource {
  actions?: string[];
  image?: string;
}

interface LessonCardProps {
  card: ICard;
}

function LessonCard({ card }: LessonCardProps) {
  return (
    <Card
      sx={{
        backgroundColor: 'white',
        border: '1px solid black',
      }}
    >
      {card.image ? (
        <CardMedia
          component="img"
          sx={{ height: 140 }}
          image={card.image}
          title={card.title}
        />
      ) : null}
      <Box sx={{ borderBottom: '1px solid black' }} />
      <CardContent>
        <Box display="flex" flexDirection="column" alignItems="start">
          <Box display="flex" flexDirection="row" alignItems="center">
            <PlayCircleOutline />
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              sx={{
                marginLeft: theme.spacing(1),
                marginRight: theme.spacing(1),
              }}
            >
              {card.title}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {card.description}
          </Typography>
        </Box>
        {card.link && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ marginTop: theme.spacing(1) }}
          >
            <a href={card.link} target="_blank" rel="noopener noreferrer">
              {card.link}
            </a>
          </Typography>
        )}
      </CardContent>
      <CardActions>
        {card.actions?.map((action) => (
          <Button size="small">{action}</Button>
        ))}
      </CardActions>
    </Card>
  );
}

export default LessonCard;
