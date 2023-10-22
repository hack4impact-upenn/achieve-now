import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/system';
// eslint-disable-next-line
import { useData, deleteData, putData } from './util/api';
import LessonCard from './components/buttons/LessonCard';
import PageHeader from './components/PageHeader';
import { useParams, useNavigate } from 'react-router-dom';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

const ScrollableBox = styled(Box)({
  overflowY: 'auto',
  maxHeight: '100%',
});

// eslint-disable-next-line
function createData(data: any) {
  return data.map((lesson: any) => {
    return <LessonCard lessonID={lesson._id} />;
  });
}

function SplitGrid() {
  const lessons = useData(`lesson/all`);
  const lessonData = lessons?.data ?? [];
  const navigator = useNavigate();

  const handleLogin = () => {
    navigator('/login');
  };

  const { studentID } = useParams(); //userID of the student
  //get the resources for the student
  let id = studentID;
  if (!id) {
    id = '64fdef20a4834502f88418b7';
  }

  const allResources = useData(`resource/all`);
  const allResourceData = allResources?.data ?? [];
  let allResourceTitles = [];
  let allResourceLinks = [];
  let allResourceIDs = [];
  let allResourceTypes = [];
  let allResourceDesc = [];

  for (let i = 0; i < allResourceData.length; i++) {
    const resource = allResourceData[i];
    allResourceTitles.push(resource.title);
    allResourceLinks.push(resource.link);
    allResourceIDs.push(resource._id);
    allResourceTypes.push(resource.type);
    allResourceDesc.push('This teaches something.');
  }

  const [checkboxValues, setCheckboxValues] = React.useState(
    new Array(allResourceTitles.length).fill(false),
  );

  const handleCheckboxChange = (index: any) => {
    const newValues = [...checkboxValues];
    const resource = allResourceData[index];
    const resid = resource._id.toString();
    if (newValues[index]) {
      //originally true, unassign
      const deleteRes = deleteData(`lesson/delete-resource`, {
        id: { id },
        resource: resid,
      });
      newValues[index] = false;
    } else {
      //originally false, assign
      const res = putData(`lesson/assign-resource`, {
        id: { id },
        resource: resid,
      });
      newValues[index] = true;
    }
    setCheckboxValues(newValues);
  };

  const resources = useData(`student/resource/${id}`);
  const resourceData = resources?.data ?? [];

  let resourceTitles = [''];
  let resourceLinks = [];
  let resourceIDs = [];
  for (let i = 0; i < resourceData.length; i++) {
    const resource = resourceData[i];
    resourceTitles.push(resource.title);
    resourceLinks.push(resource.link);
    resourceIDs.push(resource._id);
  }

  // Search bar

  const all_lessons = useData(`lesson/all`);
  const all_lessonData = all_lessons?.data ?? [];
  const idNameMapping = new Map<string, string>();
  for (let i = 0; i < lessonData.length; i += 1) {
    const lesson = lessonData[i];
    const name = `${lesson.number}`;
    idNameMapping.set(lesson._id, 'Lesson ' + name);
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
    lessonData.filter((lesson: { _id: any }) => {
      const sUserId = lesson._id;
      const name = idNameMapping.get(sUserId);
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
            <h2>Lessons</h2>
            {createData(resourceData)}
            <TextField
              label="Search"
              defaultValue="Lesson Name"
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
              <Grid item xs={6} md={6}>
                <h1>Title</h1>
                {allResourceTitles.map((item, index) => (
                  <Box>
                    <FormControlLabel
                      control={
                        <Checkbox
                          key={index}
                          checked={checkboxValues[index] || false}
                          onChange={() => handleCheckboxChange(index)}
                        />
                      }
                      label={item}
                    />
                  </Box>
                ))}
              </Grid>
              <Grid item xs={6} md={6}>
                <h1>Type</h1>
                {allResourceTypes.map((t) => (
                  <h4>{t}</h4>
                ))}
              </Grid>
              <Grid item xs={6} md={6}>
                <h1>Link</h1>
                {allResourceLinks.map((link) => (
                  <h4>{link}</h4>
                ))}
              </Grid>
              <Grid item xs={6} md={6}>
                <h1>Description</h1>
                {allResourceDesc.map((desc) => (
                  <h4>{desc}</h4>
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
