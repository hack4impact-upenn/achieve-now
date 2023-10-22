import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Box, Typography } from '@mui/material';
import Header from '../components/PageHeader';
import theme from '../assets/theme';

const mockTableData = [
  {
    key: '1',
    date: 'Monday',
    time: '8:50am - 9:50am',
    names: ["John's Block", 'Mrs. Johnson', 'Block A'],
  },
  {
    key: '2',
    date: 'Monday',
    time: '11:50am - 12:50pm',
    names: ['NAME', 'NAME'],
  },
  {
    key: '3',
    date: 'Monday',
    time: '1:30pm - 2:30pm',
    names: ['NAME', 'NAME', 'NAME'],
  },
  {
    key: '4',
    date: 'Tuesday',
    time: '8:50am - 9:50am',
    names: ['NAME'],
  },
];

const uniqueDates = Array.from(new Set(mockTableData.map((item) => item.date)));

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
          marginTop: theme.spacing(6),
          marginLeft: theme.spacing(6),
          marginRight: theme.spacing(6),
          minHeight: '80vh',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '80%',
            position: 'relative',
            paddingBottom: theme.spacing(1),
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: theme.typography.fontWeightBold,
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            Sessions
          </Typography>
          <Button
            variant="outlined"
            sx={{
              position: 'absolute',
              right: '0%',
              backgroundColor: 'white',
              borderColor: 'black',
              '&:hover': {
                backgroundColor: 'grey.200',
              },
              width: theme.spacing(20),
            }}
          >
            Add Block
          </Button>
        </Box>

        <Box p={4}>
          {/* Monday Sessions */}
          {uniqueDates.map((date) => (
            <Box key={date} mt={3}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: theme.typography.fontWeightBold,
                }}
              >
                {date}
              </Typography>
              <Box display="flex" justifyContent="space-between">
                {mockTableData
                  .filter((item) => item.date === date)
                  .map((session) => (
                    <Box
                      key={session.key}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: theme.spacing(2),
                        margin: theme.spacing(3),
                        backgroundColor: 'LightGray',
                        borderRadius: '8px',
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: theme.typography.fontWeightBold,
                        }}
                      >
                        {session.time}
                      </Typography>
                      {session.names.map((name) => (
                        <Typography variant="subtitle1">{name}</Typography>
                      ))}
                    </Box>
                  ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </div>
  );
}

export default AdminLessonsPage;
