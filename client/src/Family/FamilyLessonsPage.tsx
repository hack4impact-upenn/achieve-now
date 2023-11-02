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
/* eslint-disable import/no-extraneous-dependencies */
// import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
/* eslint-disable import/no-extraneous-dependencies */
// import InsertLinkIcon from '@mui/icons-material/InsertLink';
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

/**
 * The Family Lessons Page displays each lesson w/ the lesson number,
 * followed by a screengrid of lesson materials (cards linking to websites, videos, documents)
 * for students and families to reference.
 */
function FamilyLessonsPage() {
  const [cardsWithImages, setCardsWithImages] = useState<ICard[]>([]);

  useEffect(() => {
    const fetchResources = async () => {
      const response = await axios.get(
        'http://localhost:4000/api/resources/all',
      );
      const resources: ICard[] = response.data;

      const updatedCards = await Promise.all(
        resources.map(async (card: ICard) => {
          if (card.link) {
            try {
              const resp = await axios.post(
                'http://localhost:4000/api/thumbnail',
                {
                  url: card.link,
                },
              );
              if (resp.data && resp.data.url) {
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

    fetchResources();
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
                    <Box display="flex" alignItems="center">
                      {/* <PlayCircleOutlineIcon /> */}
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
                  <Card
                    sx={{
                      backgroundColor: 'white',
                      border: '1px solid black',
                    }}
                  >
                    <CardContent>
                      <Box display="flex" alignItems="center">
                        {/* <InsertLinkIcon /> */}
                        <Typography
                          gutterBottom
                          variant="h5"
                          component="div"
                          sx={{
                            marginLeft: theme.spacing(1),
                            marginRight: theme.spacing(1),
                          }}
                        >
                          Material
                        </Typography>
                      </Box>
                    </CardContent>
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
