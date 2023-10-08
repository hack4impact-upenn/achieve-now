import React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { useParams, useNavigate } from 'react-router-dom';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import COLORS from './assets/colors';
// import { styled } from '@mui/system';
// eslint-disable-next-line
import { useData } from './util/api';
import StudentCard from './components/buttons/StudentCard';
import PageHeader from './components/PageHeader';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const ScrollableBox = styled(Box)({
  overflowY: 'auto',
  maxHeight: '100%',
});

// eslint-disable-next-line
function createData(data: any) {
  return data.map((student: any) => {
    return <StudentCard studentID={student.user_id} lesson="Lesson 1" />;
  });
}

function SplitGrid() {
  const students = useData(`student/all`);
  const studentData = students?.data ?? [];
  const navigator = useNavigate();
  const { studentID } = useParams(); // userID of the student
  // get the resources for the student
  const resources = useData(`student/resource/${studentID}`);
  const resourceData = resources?.data ?? [];
  console.log('resources');
  console.log(resourceData);

  const resourceTitles = [];
  const resourceLinks = [];
  for (let i = 0; i < resourceData.length; i += 1) {
    const resource = resourceData[i];
    resourceTitles.push(resource.title);
    resourceLinks.push(resource.link);
  }

  console.log(resourceTitles);
  console.log(resourceLinks);

  const handleLogin = () => {
    navigator('/login');
  };

  return (
    <Box>
      <PageHeader />
      <Box display="flex" flexDirection="column" width="100%" height="100vh">
        <Box display="flex" flexGrow={5}>
          <Paper
            sx={{
              width: '30%',
              overflowY: 'auto',
              maxHeight: 'calc(100vh - 64px)', // Subtract the Toolbar height (default is 64px)
              bgcolor: 'white',
              p: 2,
            }}
            elevation={0}
            square
          >
            <h2>Students</h2>
            {createData(studentData)}
          </Paper>

          <Paper
            sx={{
              width: '70%',
              overflowY: 'auto',
              maxHeight: 'calc(100vh - 64px)', // Subtract the Toolbar height (default is 64px)
              bgcolor: '#EDEDED',
              p: 2,
              paddingX: 4,
            }}
            elevation={0}
            square
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Box>
                <h2>Additional Resources</h2>
              </Box>

              <Box>
                <Button
                  sx={{ color: 'black', borderColor: 'black', margin: 2 }}
                  variant="outlined"
                  color="primary"
                  onClick={handleLogin}
                >
                  Edit
                </Button>
                <Button
                  sx={{ color: 'black', borderColor: 'black' }}
                  variant="outlined"
                  color="primary"
                  onClick={handleLogin}
                >
                  Assign
                </Button>
              </Box>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6} md={6}>
                <h1>Title</h1>
                {resourceTitles.map((title) => (
                  <FormControlLabel control={<Checkbox />} label={title} />
                ))}
              </Grid>
              <Grid item xs={6} md={6}>
                <h1>Link</h1>
                {resourceLinks.map((link) => (
                  <h4>{link}</h4>
                ))}
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

export default SplitGrid;
