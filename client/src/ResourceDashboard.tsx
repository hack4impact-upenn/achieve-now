/* eslint no-underscore-dangle: 0 */
import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/system';
// eslint-disable-next-line
import { useData, deleteData, putData } from './util/api';
import { useParams, useNavigate } from 'react-router-dom';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import PageHeader from './components/PageHeader';
import StudentCard from './components/buttons/StudentCard';

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
  console.log(studentData);

  const handleLogin = () => {
    navigator('/login');
  };

  const { studentID } = useParams(); // userID of the student
  // get the resources for the student
  let id = studentID;
  if (!id) {
    id = '64fdef20a4834502f88418b7';
  }

  const allResources = useData(`resource/all`);
  const allResourceData = allResources?.data ?? [];
  const allResourceTitles = [];
  const allResourceLinks = [];
  const allResourceIDs = [];
  const allResourceDesc = [];
  const allResourceTypes = [];

  for (let i = 0; i < allResourceData.length; i += 1) {
    const resource = allResourceData[i];
    allResourceTitles.push(resource.title);
    allResourceLinks.push(resource.link);
    allResourceIDs.push(resource._id);
    allResourceDesc.push(resource.description);
    allResourceTypes.push(resource.type);
  }

  const [checkboxValues, setCheckboxValues] = React.useState(
    new Array(allResourceTitles.length).fill(false),
  );

  const handleCheckboxChange = (index: any) => {
    const newValues = [...checkboxValues];
    const resource = allResourceData[index];
    const resid = resource._id.toString();
    if (newValues[index]) {
      // originally true, unassign
      const deleteRes = deleteData(`student/delete-resource`, {
        id: { id },
        resource: resid,
      });
      newValues[index] = false;
    } else {
      // originally false, assign
      const res = putData(`student/assign-resource`, {
        id: { id },
        resource: resid,
      });
      newValues[index] = true;
    }
    setCheckboxValues(newValues);
  };

  const resources = useData(`student/resource/${id}`);
  const resourceData = resources?.data ?? [];

  const resourceTitles = [''];
  const resourceLinks = [];
  const resourceIDs = [];
  for (let i = 0; i < resourceData.length; i += 1) {
    const resource = resourceData[i];
    resourceTitles.push(resource.title);
    resourceLinks.push(resource.link);
    resourceIDs.push(resource._id);
  }

  // Search bar

  const users = useData(`admin/all`);
  const userData = users?.data ?? [];
  const idAgeMapping = new Map<string, string>();
  for (let i = 0; i < userData.length; i += 1) {
    const user = userData[i];
    const name = `${user.firstName} ${user.lastName}`;
    idAgeMapping.set(user._id, name);
  }

  const [searchInput, setSearchInput] = React.useState('');

  const handleChange = (e: {
    preventDefault: () => void;
    target: { value: React.SetStateAction<string> };
  }) => {
    e.preventDefault();
    setSearchInput(e.target.value);
  };

  if (searchInput.length > 0) {
    studentData.filter((student: { _id: any }) => {
      const sUserId = student._id;
      const name = idAgeMapping.get(sUserId);
      if (!name) {
        return false;
      }
      return name.match(searchInput);
    });
  }

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
            <TextField
              label="Search"
              defaultValue="Name"
              onChange={handleChange}
              value={searchInput}
            />
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
                >
                  Edit
                </Button>
                {/* <Button
                        sx={{ color: 'black', borderColor: 'black' }}
                        variant="outlined"
                        color="primary"
                        onClick={handleLogin}
                        >
                        Assign
                    </Button> */}
              </Box>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={2} md={3}>
                <h1>Title</h1>
                {allResourceTitles.map((item, index) => (
                  <Box>
                    <FormControlLabel
                      control={
                        <Checkbox
                          key={item}
                          checked={checkboxValues[index] || false}
                          onChange={() => handleCheckboxChange(index)}
                        />
                      }
                      label={item}
                    />
                  </Box>
                ))}
              </Grid>
              <Grid item xs={2} md={3}>
                <h1>Description</h1>
                {allResourceDesc.map((link) => (
                  <h4>{link}</h4>
                ))}
              </Grid>
              <Grid item xs={2} md={3}>
                <h1>Type</h1>
                {allResourceTypes.map((link) => (
                  <h4>{link}</h4>
                ))}
              </Grid>
              <Grid item xs={2} md={3}>
                <h1>Link</h1>
                {allResourceLinks.map((link) => (
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
