import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Box, Typography } from '@mui/material';
import moment from 'moment';
import Header from '../components/PageHeader';
import theme from '../assets/theme';
import { useData } from '../util/api';
import IBlock from '../util/types/block';

function AdminLessonsPage() {
  const [blockList, setBlockList] = useState<IBlock[]>([]);
  const [uniqueDays, setUniqueDays] = useState<string[]>([]);
  const blocks = useData('admin/blocks');

  useEffect(() => {
    const data = blocks?.data || [];
    setBlockList(data);
    setUniqueDays(Array.from(new Set(data.map((block: IBlock) => block.day))));
    console.log(data);
  }, [blocks]);

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
          {uniqueDays.map((day) => (
            <Box key={day} mt={3}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: theme.typography.fontWeightBold,
                }}
              >
                {day}
              </Typography>
              <Box display="flex" justifyContent="space-between">
                {blockList
                  .filter((item) => item.day === day)
                  .map((session) => (
                    <Box
                      // key={session._id}
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
                        {moment(session.startTime, 'HH:mm').format('LT')}-
                        {moment(session.endTime, 'HH:mm').format('LT')}
                      </Typography>
                      {session.students.map((name) => (
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
