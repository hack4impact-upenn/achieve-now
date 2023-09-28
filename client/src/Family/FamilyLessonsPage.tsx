import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button,
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@mui/material';
import Header from '../components/PageHeader';
import theme from '../assets/theme';

interface IResource {
  id: string;
  title: string;
  link: string;
}

interface ICard extends IResource {
  actions?: string[];
  image?: string;
}

const cards: ICard[] = [
  {
    id: '0',
    title: 'lizard website example',
    link: 'https://reptilerapture.net/',
    actions: ['Share', 'Learn More'],
  },
  {
    id: '1',
    title: 'video example',
    link: 'https://www.youtube.com/watch?v=KrLj6nc516A',
    actions: ['Learn More'],
  },
  {
    id: '2',
    title: 'docs example',
    link: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit?usp=sharing',
  },
  {
    id: '3',
    title: 'this one has no picture',
    link: '',
  },
  {
    id: '4',
    title: 'this one also without picture',
    link: '',
  },
  // ... other cards ...
];

/**
 * The Family Lessons Page displays each lesson w/ the lesson number,
 * followed by a screengrid of lesson materials (cards linking to websites, videos, documents)
 * for students and families to reference.
 */
function FamilyLessonsPage() {
  const [cardsWithImages, setCardsWithImages] = useState<ICard[]>([]);
  useEffect(() => {
    const fetchImages = async () => {
      const updatedCards = await Promise.all(
        cards.map(async (card: ICard) => {
          if (card.link) {
            try {
              const response = await axios.post(
                'http://localhost:4000/api/thumbnail',
                {
                  url: card.link,
                },
              );
              console.log(response.data);
              if (response.data && response.data.url) {
                return { ...card, image: response.data.url };
              }
            } catch (error) {
              console.error('Error fetching thumbnail:', error);
            }
          }
          return card;
        }),
      );
      setCardsWithImages(updatedCards);
    };

    fetchImages();
  }, []);

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
            Lesson Placeholder
          </Typography>
          <Box sx={{ marginTop: theme.spacing(-3) }}>
            <hr />
          </Box>
          <Grid container spacing={3} sx={{ marginTop: theme.spacing(1) }}>
            {cardsWithImages.map((card) => (
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  {card.image ? (
                    <CardMedia
                      component="img"
                      sx={{ height: 140 }}
                      image={card.image}
                      title={card.title}
                    />
                  ) : null}
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {card.title}
                    </Typography>
                    {card.link && (
                      <Typography variant="body2" color="text.secondary">
                        <a
                          href={card.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
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
            {Array(3)
              .fill(null)
              .map(() => (
                <Grid item xs={12} sm={6} md={4}>
                  <Card>
                    <CardContent>Material</CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Box>
      </Box>
    </div>
  );
}

export default FamilyLessonsPage;
