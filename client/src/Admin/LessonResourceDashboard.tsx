/* eslint no-underscore-dangle: 0 */
import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
// eslint-disable-next-line
import { useParams, useNavigate } from 'react-router-dom';
import { useData, deleteData, putData, postData } from '../util/api';
import PageHeader from '../components/PageHeader';
import { StudentCardFromObj } from './StudentCard';
import SearchStudentsBar from './SearchBar';
import ResourceTable from './ResourceTable';

// eslint-disable-next-line
function createData(data: any) {
  return data.map((student: any) => {
    return <StudentCardFromObj studentObj={student} />;
  });
}

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
  const { id } = useParams();
  const studentsRes = useData(`student/all-info`);
  const allStudents = studentsRes?.data || [];
  const [currStudents, setCurrStudents] = React.useState<any[]>([]);

  const resourcesRes = useData(`resources/all`);
  const [parentResources, setParentResources] = React.useState<IRow[]>([]);
  const [coachResources, setCoachResources] = React.useState<IRow[]>([]);

  useEffect(() => {
    const getResources = async () => {
      const allResourceData = resourcesRes?.data || [];

      const parentRes = await postData(`student/resource/additional/${id}`, {
        role: 'parent',
      });
      const parentData = parentRes?.data || [];
      const oldParentResources = allResourceData;

      const coachRes = await postData(`student/resource/additional/${id}`, {
        role: 'coach',
      });
      const coachData = coachRes?.data || [];
      const oldCoachResources = allResourceData;

      parentData.forEach((resource: any) => {
        const resId = resource.id.toString();
        const index = allResourceData.findIndex(
          (res: any) => res.id.toString() === resId,
        );
        if (index !== -1) {
          oldParentResources[index].isChecked = true;
        } else {
          oldParentResources[index].isChecked = false;
        }
      });

      coachData.forEach((resource: any) => {
        const resId = resource.id.toString();
        const index = allResourceData.findIndex(
          (res: any) => res.id.toString() === resId,
        );
        if (index !== -1) {
          oldCoachResources[index].isChecked = true;
        } else {
          oldCoachResources[index].isChecked = false;
        }
      });
      setParentResources(oldParentResources);
      setCoachResources(oldCoachResources);
      setCurrStudents(studentsRes?.data || []);
    };
    getResources();
  }, [id, resourcesRes?.data, studentsRes?.data]);

  // Search bar
  const idAgeMapping = new Map<string, string>();
  for (let i = 0; i < allStudents.length; i += 1) {
    const user = allStudents[i];
    const name = `${user.firstName} ${user.lastName}`;
    idAgeMapping.set(user.studentId, name);
  }

  const handleSearch = (searchInput: string) => {
    if (searchInput.length > 0) {
      const newCurrStudents = allStudents.filter((student: { _id: any }) => {
        // eslint-disable-next-line no-underscore-dangle
        const sUserId = student._id;
        const name = idAgeMapping.get(sUserId);
        if (!name) {
          return false;
        }
        return name.match(searchInput);
      });
      setCurrStudents(newCurrStudents);
    }
  };

  const handleParentCheckboxChange = async (studentId: string) => {
    const newValues = [...parentResources];
    const resource = parentResources.find((res) => res._id === id);
    const index = parentResources.findIndex((res) => res._id === id);
    if (!resource) {
      return;
    }
    if (resource.isChecked) {
      // originally true, unassign
      const deleteRes = await deleteData(`student/delete-resource`, {
        id: { studentId },
        resource: id,
      });
      if (deleteRes.error) {
        console.log(deleteRes.error);
      }
      newValues[index].isChecked = false;
    } else {
      // originally false, assign
      const res = await putData(`student/assign-resource`, {
        id: { studentId },
        resource: id,
      });
      if (res.error) {
        console.log(res.error);
      }
      newValues[index].isChecked = true;
    }
    setParentResources(newValues);
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
            <h2>Lessons</h2>
            {createData(currStudents)}
            <SearchStudentsBar handleSearch={handleSearch} />
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
                <h2>Lesson 3 Resources</h2>
                {/* FLAG: fix this hardcoding */}
              </Box>
              {!id ? (
                <h2>No Lesson Selected </h2>
              ) : (
                <ResourceTable
                  allResources={parentResources}
                  handleCheckboxChange={handleParentCheckboxChange}
                />
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

export default LessonResourceDashboard;
