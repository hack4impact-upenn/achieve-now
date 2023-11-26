import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Button, Box, Typography, Link } from '@mui/material';
import { BlockOutlined } from '@material-ui/icons';
import { useNavigate } from 'react-router-dom';
import Header from '../components/PageHeader';
import theme from '../assets/theme';
import { useData } from '../util/api';
import IBlock from '../util/types/block';

function AdminSessionsPage() {
  const [blockDict, setBlockDict] = useState<{ [key: string]: any }>({});
  const [uniqueDays, setUniqueDays] = useState<string[]>([]);
  const blocks = useData('admin/blocks');
  const navigate = useNavigate();

  useEffect(() => {
    const data = blocks?.data || {};
    setBlockDict(data);
    setUniqueDays(Object.keys(data));
  }, [blocks]);

  const handleAddBlock = () => {
    navigate(`/admin/add-block`);
  };
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
            onClick={handleAddBlock}
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
              <Box display="flex" justifyContent="left">
                {Object.keys(blockDict[day]).map((slot) => (
                  <Box
                    // key={session.key}
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
                      {moment(
                        blockDict[day][slot][0].startTime,
                        'HH:mm',
                      ).format('LT')}
                      -
                      {moment(blockDict[day][slot][0].endTime, 'HH:mm').format(
                        'LT',
                      )}
                    </Typography>
                    {blockDict[day][slot].map((block: IBlock) => (
                      /* eslint no-underscore-dangle: 0 */
                      <Link href={`/admin-block/${block._id}`}>
                        <Typography variant="subtitle1">
                          {block.name}
                        </Typography>
                      </Link>
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

export default AdminSessionsPage;
