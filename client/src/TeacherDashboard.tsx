import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/system';
// eslint-disable-next-line
import { useData } from './util/api';
import { StudentCardFromID } from './Admin/StudentCard';
import PageHeader from './components/PageHeader';

const ScrollableBox = styled(Box)({
  overflowY: 'auto',
  maxHeight: '100%',
});

// // eslint-disable-next-line
// function createStudentCard(student: any) {
//   const id = student.user_id;
//   console.log(id)
//   const user = useData(`users/${id}`);
//   console.log(user)
//   if (user) {
//     const info = user.data;
//     const name = `${info.firstName} ${info.lastName}`;
//     const lesson = student.lesson_level;
//     return <StudentCard studentName={name} lesson={lesson} />;
//   }
// }

// eslint-disable-next-line
function createData(data: any) {
  return data.map((student: any) => {
    return <StudentCardFromID studentID={student.user_id} lesson="Lesson 1" />;
  });
}

function SplitGrid() {
  const id = '111';
  const students = useData(`student/teacher/${id}`);
  const studentData = students?.data ?? [];

  // const student_users = []
  // for (let i = 0; i < studentData.length; i++) {
  //   const user_id = studentData[i].user_id;
  //   const user = useData(`users/${id}`);
  //   student_users.push(user);
  // }

  console.log(studentData);

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
            <h2>Class Progress</h2>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

export default SplitGrid;
