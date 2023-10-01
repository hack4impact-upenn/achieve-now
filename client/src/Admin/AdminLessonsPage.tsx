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
import ScreenGrid from '../components/ScreenGrid';

/**
 * The Family Lessons Page displays each lesson w/ the lesson number,
 * followed by a screengrid of lesson materials (cards linking to websites, videos, documents)
 * for students and families to reference.
 */
function AdminLessonsPage() {
  return (
    <div>
      <Header />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: theme.spacing(10),
          marginLeft: theme.spacing(6),
          marginRight: theme.spacing(6),
          minHeight: '80vh',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              right: '10%',
              display: 'flex',
              gap: theme.spacing(2),
            }}
          >
            <Button
              variant="outlined"
              sx={{
                backgroundColor: 'white',
                borderColor: 'black',
                '&:hover': {
                  backgroundColor: 'grey.200',
                },
                width: theme.spacing(10),
              }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              sx={{
                backgroundColor: 'white',
                borderColor: 'black',
                '&:hover': {
                  backgroundColor: 'grey.200',
                },
                width: theme.spacing(10),
              }}
            >
              Add
            </Button>
          </Box>
          <Typography
            variant="h2"
            sx={{ fontWeight: theme.typography.fontWeightBold }}
          >
            Lesson Placeholder
          </Typography>
        </Box>

        <Box
          sx={{
            marginTop: theme.spacing(2),
            width: '100%',
            backgroundColor: 'grey.300',
            flexGrow: 1,
            padding: theme.spacing(2),
          }}
        >
          <Grid container spacing={3} sx={{ paddingLeft: theme.spacing(10) }}>
            <Grid item xs={3}>
              <Box>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: theme.typography.fontWeightBold }}
                >
                  Name
                </Typography>
                <Typography>hello</Typography>
              </Box>
            </Grid>
            <Grid item xs={9}>
              <Box>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: theme.typography.fontWeightBold }}
                >
                  Link
                </Typography>
                <Typography
                  sx={{ whiteSpace: 'normal', overflowWrap: 'break-word' }}
                >
                  https://docs.google.com/document/d/1-9ZUPY1Tu2d_2o1q6WtW7UlthlgHkYK9JE2jboz9jvo/edit#heading=h.fujobm47wwib
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </div>
  );
}

export default AdminLessonsPage;
