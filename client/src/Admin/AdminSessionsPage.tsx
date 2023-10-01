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
function AdminSessionsPage() {
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
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            position: 'relative',
            gap: theme.spacing(-1),
            paddingBottom: theme.spacing(1),
          }}
        >
          <Typography
            variant="h2"
            sx={{ fontWeight: theme.typography.fontWeightBold }}
          >
            Placeholder Block 1
          </Typography>
          <Typography variant="h5" component="div">
            <b>Zoom Link: </b>
            <a
              href="https://zoom.us/join"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://zoom.us/join
            </a>
          </Typography>
          <Box
            sx={{
              position: 'absolute',
              right: '10%',
              top: '50%',
              transform: 'translateY(-50%)',
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
                width: theme.spacing(20),
              }}
            >
              Edit Pair
            </Button>
          </Box>
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
                  sx={{ fontWeight: theme.typography.fontWeightBold, mb: 2 }}
                >
                  Student
                </Typography>
                <Typography>Anna Bay</Typography>
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: theme.typography.fontWeightBold, mb: 2 }}
                >
                  Coach
                </Typography>
                <Typography
                  sx={{ whiteSpace: 'normal', overflowWrap: 'break-word' }}
                >
                  Helena Zhou
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: theme.typography.fontWeightBold, mb: 2 }}
                >
                  Next Steps
                </Typography>
                <Button
                  variant="outlined"
                  sx={{
                    backgroundColor: 'white',
                    borderColor: 'black',
                    '&:hover': {
                      backgroundColor: 'grey.200',
                    },
                    width: theme.spacing(15),
                  }}
                >
                  See More
                </Button>
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: theme.typography.fontWeightBold, mb: 2 }}
                >
                  Observations
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </div>
  );
}

export default AdminSessionsPage;
