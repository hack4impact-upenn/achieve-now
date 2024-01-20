import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import Header from '../components/PageHeader';
import theme from '../assets/theme';
import { useData, URLPREFIX } from '../util/api';

interface IResource {
  id: string;
  title: string;
  link: string;
}

function UpdatesComponent(props: any) {
  const [updateText, setUpdateText] = useState('');
  const { studentID } = props;
  useEffect(() => {
    const fetchUpdate = async () => {
      const response = await axios.get(
        `http://localhost:4000/api/student/student/${studentID}`,
      );
      setUpdateText(response?.data.updates);
    };

    fetchUpdate();
  });

  return (
    <Card
      sx={{
        backgroundColor: 'white',
        border: '1px solid black',
      }}
    >
      <Box sx={{ borderBottom: '1px solid black' }} />
      <CardContent>
        <Box display="flex" alignItems="center">
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{
              marginLeft: theme.spacing(1),
              marginRight: theme.spacing(1),
            }}
          />
        </Box>
        <Typography
          variant="h2"
          sx={{ fontWeight: theme.typography.fontWeightBold }}
        >
          Updates
        </Typography>
        <Typography variant="h6">{updateText}</Typography>
      </CardContent>
    </Card>
  );
}

function FamilyProgressSnapshotPage() {
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
          <Grid item xs={12} sm={6} md={4}>
            <UpdatesComponent studentID="64fdef20a4834502f88418b7" />
          </Grid>
        </Box>
      </Box>
    </div>
  );
}

export default FamilyProgressSnapshotPage;
