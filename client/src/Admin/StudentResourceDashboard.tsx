/* eslint no-underscore-dangle: 0 */
import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useParams } from 'react-router-dom';
import { useData, postData } from '../util/api';
import PageHeader from '../components/PageHeader';
import { StudentCardFromObj } from './StudentCard';
import SearchBar from './SearchBar';
import ResourceTable from './ResourceTable';

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

function StudentResourceDashboard() {
  const { studentId } = useParams();
  const studentsRes = useData(`student/all/info`);
  const [studentName, setStudentName] = React.useState<string>('');
  const [allStudents, setAllStudents] = React.useState<any[]>([]);
  const [currStudents, setCurrStudents] = React.useState<any[]>([]);

  useEffect(() => {
    const allStudentData = studentsRes?.data || [];
    const name = allStudentData.find((student: any) => {
      if (!studentId) {
        return false;
      }
      return student.studentId === studentId;
    });
    setStudentName(name ? `${name.firstName} ${name.lastName}` : '');
    setAllStudents(allStudentData || []);
    setCurrStudents(allStudentData || []);
  }, [studentId, studentsRes]);

  const resourcesRes = useData(`resources/all`);
  const [parentResources, setParentResources] = React.useState<IRow[]>([]);
  const [coachResources, setCoachResources] = React.useState<IRow[]>([]);

  useEffect(() => {
    const getResources = async () => {
      if (!studentId) {
        return;
      }
      const allResourceData = resourcesRes?.data || [];

      const parentRes = await postData(
        `student/resource/additional/${studentId}`,
        {
          role: 'parent',
        },
      );
      const parentData = parentRes?.data || [];

      const coachRes = await postData(
        `student/resource/additional/${studentId}`,
        {
          role: 'coach',
        },
      );
      const coachData = coachRes?.data || [];

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

      setParentResources(newParentResources || []);
      setCoachResources(newCoachResources || []);
    };
    getResources();
  }, [currStudents, studentId, resourcesRes?.data, resourcesRes, studentName]);

  const handleSearch = (searchInput: string) => {
    if (searchInput.length > 0) {
      const newCurrStudents = allStudents.filter((student) => {
        return (
          student.firstName.toLowerCase().match(searchInput) ||
          student.lastName.toLowerCase().match(searchInput)
        );
      });
      setCurrStudents(newCurrStudents);
    } else {
      setCurrStudents(allStudents);
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
      const deleteRes = await postData(`student/delete-resource`, {
        id: studentId,
        resource: resourceId,
        role: 'parent',
      });
      if (deleteRes.error) {
        console.log(deleteRes.error);
      }
      newValues[index].isChecked = false;
    } else {
      // originally false, assign
      const res = await postData(`student/assign-resource`, {
        id: studentId,
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
      const deleteRes = await postData(`student/delete-resource`, {
        id: studentId,
        resource: resourceId,
        role: 'coach',
      });
      if (deleteRes.error) {
        console.log(deleteRes.error);
      }
      newValues[index].isChecked = false;
    } else {
      // originally false, assign
      const res = await postData(`student/assign-resource`, {
        id: studentId,
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
          <h1>Students</h1>
          <SearchBar handleSearch={handleSearch} />
          {currStudents.map((student: any) => {
            return <StudentCardFromObj studentObj={student} />;
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
              {!studentId || studentName === ''
                ? 'Select a Student'
                : `Student: ${studentName}`}
            </h1>
            <h3>Parent Additional Resources</h3>
            {!studentId ? (
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
            {!studentId ? (
              <Box height="100px" />
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

export default StudentResourceDashboard;
