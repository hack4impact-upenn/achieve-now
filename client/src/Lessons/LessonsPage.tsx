import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import Header from '../components/PageHeader';
import theme from '../assets/theme';
import LessonCard from './LessonCard';
import { getData, postData, useData } from '../util/api';
import { useAppSelector } from '../util/redux/hooks';
import { selectUser } from '../util/redux/userSlice';
import { getLessonStringFromLessonLevel } from '../util/lessonLevels';

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

/**
 * The Lessons Page displays each lesson w/ the lesson number,
 * followed by a screengrid of lesson materials (cards linking to websites, videos, documents)
 * for students and coaches to reference.
 */
function LessonsPage() {
  const user = useAppSelector(selectUser);
  // const user = {
  //   role: 'parent',
  // };
  const { role, id } = user;
  const [cardsWithImages, setCardsWithImages] = useState<ICard[]>([]);
  const [addCardsWithImages, setAddCardsWithImages] = useState<ICard[]>([]);
  const [lessonNumber, setLessonNumber] = useState<string>('');
  const [lessonTitle, setLessonTitle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const fetchResources = async () => {
      let resources;
      if (role === 'parent') {
        resources = await postData(`student/resource/all/${id}`, {
          role,
        });
      } else {
        resources = await getData(`coach/resources/${id}`);
      }

      if (resources.error) {
        if (
          resources.error.data.message.includes('connected to any students')
        ) {
          setErrorMessage('Coach is not connected to any students.');
          return;
        }
        setErrorMessage(resources.error.data.message);
        return;
      }

      const lessonResources = resources?.data.resources || [];
      const addResources = resources?.data.additional_resources || [];
      const num = resources?.data.lesson_level || '';
      setLessonNumber(num);
      setLessonTitle(resources?.data.lesson_title || '');
      const updatedCards = await Promise.all(
        lessonResources.map(async (card: ICard) => {
          if (card.link) {
            try {
              const resp = await postData('thumbnail', {
                url: card.link,
              });
              if (resp.data && resp.data.url) {
                return { ...card, image: resp.data.url };
              }
            } catch (error) {
              console.error('Error fetching thumbnail:', error);
            }
          }
          return card;
        }),
      );
      const updatedAddCards = await Promise.all(
        addResources.map(async (card: ICard) => {
          if (card.link) {
            try {
              const resp = await postData('thumbnail', {
                url: card.link,
              });
              if (resp.data && resp.data.url) {
                return { ...card, image: resp.data.url };
              }
            } catch (error) {
              console.error('Error fetching thumbnail:', error);
            }
          }
          return card;
        }),
      );
      setAddCardsWithImages(updatedAddCards);
      setCardsWithImages(updatedCards);
      setLoading(false);
    };
    fetchResources();
  }, [role, id]);

  if (errorMessage) {
    return (
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Typography
          variant="h2"
          sx={{
            textAlign: 'center',
          }}
        >
          {errorMessage}
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <Header />
      <Box
        sx={{
          padding: theme.spacing(4),
          marginTop: theme.spacing(2),
        }}
      >
        <Box
          sx={{
            marginBottom: theme.spacing(10),
          }}
        >
          <Typography
            variant="h2"
            sx={{ fontWeight: theme.typography.fontWeightBold }}
          >
            {`${getLessonStringFromLessonLevel(
              Number(lessonNumber),
            )} ${lessonTitle}`}
          </Typography>
          <Box sx={{ marginTop: theme.spacing(-3) }}>
            <hr />
          </Box>
          <Grid container spacing={3} sx={{ marginTop: theme.spacing(1) }}>
            {cardsWithImages.map((card) => (
              <Grid item xs={12} sm={6} md={4}>
                <LessonCard card={card} />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box>
          <Typography
            variant="h2"
            sx={{ fontWeight: theme.typography.fontWeightBold }}
          >
            Additional Resources
          </Typography>
          <Box sx={{ marginTop: theme.spacing(-3) }}>
            <hr />
          </Box>
          <Grid container spacing={3} sx={{ marginTop: theme.spacing(1) }}>
            {addCardsWithImages.map((card) => (
              <Grid item xs={12} sm={6} md={4}>
                <LessonCard card={card} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </div>
  );
}

export default LessonsPage;
