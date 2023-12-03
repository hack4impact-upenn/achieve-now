import React from 'react';
import {
  Button,
  Box,
  Card,
  CardActions,
  CardMedia,
  Typography,
  CardActionArea,
} from '@mui/material';
import { PlayCircleOutline } from '@mui/icons-material';
import theme from '../assets/theme';

const colors = ['#ff6d23', '#00aaa8', '#a3c800'];

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
      <CardActionArea onClick={() => window.open(card.link)}>
        {card.image ? (
          <CardMedia
            component="img"
            sx={{ height: 140 }}
            image={card.image}
            title={card.title}
          />
        ) : (
          <Box
            sx={{
              height: 140,
              backgroundColor:
                colors[Math.floor(Math.random() * colors.length)],
            }}
          />
        )}
      </CardActionArea>
      <Box sx={{ borderBottom: '1px solid black' }} />
      <CardActionArea
        onClick={() => window.open(card.link)}
        sx={{ padding: '1rem' }}
      >
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
      </CardActionArea>
    </Card>
  );
}

export default LessonCard;
