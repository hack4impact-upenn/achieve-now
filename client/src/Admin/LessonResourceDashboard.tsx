/* eslint no-underscore-dangle: 0 */
import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useParams } from 'react-router-dom';
import { useData, postData } from '../util/api';
import PageHeader from '../components/PageHeader';
import SearchBar from './SearchBar';
import ResourceTable from './ResourceTable';
import LessonCardFromObj from './LessonCard';

interface IResource {
  _id: string;
  title: string;
  description: string;
  type: string;
  link: string;
}

interface IRow extends IResource {
  isChecked: boolean;
}

function LessonResourceDashboard() {
  const { lessonId } = useParams();
  const lessonsRes = useData(`lesson/all`);
  const [lessonNumber, setLessonNumber] = React.useState<string>('');
  const [allLessons, setAllLessons] = React.useState<any[]>([]);
  const [currLessons, setCurrLessons] = React.useState<any[]>([]);

  useEffect(() => {
    const allLessonData = lessonsRes?.data || [];
    const sortedLessonData = allLessonData.sort((a: any, b: any) => {
      return a.number - b.number;
    });
    setAllLessons(sortedLessonData);
    setCurrLessons(sortedLessonData);
  }, [lessonsRes]);

  const resourcesRes = useData(`resources/all`);
  const [parentResources, setParentResources] = React.useState<IRow[]>([]);
  const [coachResources, setCoachResources] = React.useState<IRow[]>([]);

  useEffect(() => {
    const getResources = async () => {
      const allResourceData = resourcesRes?.data || [];
      const lessonRes = await postData(`lesson/${lessonId || ''}/resources`);
      const lessonData = lessonRes?.data;
      if (!lessonData) {
        return;
      }
      const num = lessonData.number || '';
      setLessonNumber(num);
      const parentData = lessonData.parent_resources || [];
      const coachData = lessonData.coach_resources || [];

      const newParentResources = allResourceData.map((resource: any) => {
        const index = parentData.findIndex(
          (res: any) => res._id.toString() === resource._id.toString(),
        );
        if (index !== -1) {
          return { ...resource, isChecked: true };
        }
        return { ...resource, isChecked: false };
      });

      const newCoachResources = allResourceData.map((resource: any) => {
        const index = coachData.findIndex(
          (res: any) => res._id.toString() === resource._id.toString(),
        );
        if (index !== -1) {
          return { ...resource, isChecked: true };
        }
        return { ...resource, isChecked: false };
      });

      setParentResources(newParentResources);
      setCoachResources(newCoachResources);
    };
    getResources();
  }, [currLessons, lessonId, resourcesRes?.data, resourcesRes, lessonNumber]);

  const handleSearch = (searchInput: string) => {
    if (searchInput.length > 0) {
      const newCurrLessons = allLessons.filter((lesson) => {
        return lesson.number.toString().match(searchInput);
      });
      setCurrLessons(newCurrLessons);
    } else {
      setCurrLessons(allLessons);
    }
  };

  const handleParentCheckboxChange = async (resourceId: string) => {
    const newValues = [...parentResources];
    const resource = parentResources.find((res) => res._id === resourceId);
    const index = parentResources.findIndex((res) => res._id === resourceId);
    if (!resource) {
      return;
    }
    if (resource.isChecked) {
      // originally true, unassign
      const deleteRes = await postData(`lesson/deleteResource`, {
        id: lessonId,
        resource: resourceId,
        role: 'parent',
      });
      if (deleteRes.error) {
        console.log(deleteRes.error);
      }
      newValues[index].isChecked = false;
    } else {
      // originally false, assign
      const res = await postData(`lesson/addResource`, {
        id: lessonId,
        resource: resourceId,
        role: 'parent',
      });
      if (res.error) {
        console.log(res.error);
      }
      newValues[index].isChecked = true;
    }
    setParentResources(newValues);
  };

  const handleCoachCheckBoxChange = async (resourceId: string) => {
    const newValues = [...coachResources];
    const resource = coachResources.find((res) => res._id === resourceId);
    const index = coachResources.findIndex((res) => res._id === resourceId);
    if (!resource) {
      return;
    }
    if (resource.isChecked) {
      // originally true, unassign
      const deleteRes = await postData(`lesson/deleteResource`, {
        id: lessonId,
        resource: resourceId,
        role: 'coach',
      });
      if (deleteRes.error) {
        console.log(deleteRes.error);
      }
      newValues[index].isChecked = false;
    } else {
      // originally false, assign
      const res = await postData(`lesson/addResource`, {
        id: lessonId,
        resource: resourceId,
        role: 'coach',
      });
      if (res.error) {
        console.log(res.error);
      }
      newValues[index].isChecked = true;
    }
    setCoachResources(newValues);
  };

  return (
    <Box>
      <PageHeader />
      <Box
        display="flex"
        flexDirection="row"
        width="100%"
        height="calc(100vh - 66px)"
      >
        <Paper
          sx={{
            width: '25%',
            overflowY: 'auto',
            maxHeight: 'calc(100vh - 66px)', // Subtract the Toolbar height (default is 64px)
            bgcolor: 'white',
            p: 2,
          }}
          elevation={0}
          square
        >
          <h1>Lessons</h1>
          <SearchBar handleSearch={handleSearch} />
          {currLessons.map((lesson: any) => {
            return <LessonCardFromObj lessonObj={lesson} />;
          })}
        </Paper>

        <Paper
          sx={{
            width: '75%',
            overflowY: 'auto',
            maxHeight: 'calc(100vh - 66px)', // Subtract the Toolbar height (default is 64px)
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
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <h1>
              {!lessonId || lessonNumber === ''
                ? 'Select a Lesson'
                : `Lesson ${lessonNumber}`}
            </h1>
            <h3>Parent Additional Resources</h3>
            {!lessonId ? (
              <Box height="100px" />
            ) : (
              <ResourceTable
                allResources={parentResources}
                handleCheckboxChange={handleParentCheckboxChange}
              />
            )}
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              marginTop: '24px',
            }}
          >
            <Box>
              <h3>Coach Additional Resources</h3>
            </Box>
            {!lessonId ? (
              <Box height="40%" />
            ) : (
              <ResourceTable
                allResources={coachResources}
                handleCheckboxChange={handleCoachCheckBoxChange}
              />
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default LessonResourceDashboard;
