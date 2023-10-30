import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography,
  Grid,
  TextField,
  MenuItem,
  Select,
  SelectChangeEvent,
  Button,
  Autocomplete,
} from '@mui/material';
import { Box, display } from '@mui/system';
import { PaginationTable, TColumn } from '../components/PaginationTable';
import Header from '../components/PageHeader';
import theme from '../assets/theme';
import ScreenGrid from '../components/ScreenGrid';
import FormGrid from '../components/form/FormGrid';
import FormCol from '../components/form/FormCol';
import PrimaryButton from '../components/buttons/PrimaryButton';
import { useData } from '../util/api';
import IUser from '../util/types/user';
import IStudent from '../util/types/student';
import { addBlock } from '../Authentication/api';

interface AdminAddBlockPage {
  key: string;
  date: string;
  studentObservations: string;
  studentNextSteps: string;
  coachObservations: string;
  coachNextSteps: string;
}

const initialTableData = [
  {
    key: '1',
    date: '10/05/2023',
    studentObservations: 'Worked on vowels today.',
    studentNextSteps: 'Maria was a little distracted...',
    coachObservations: 'Cell',
    coachNextSteps: 'Cell',
  },
  {
    key: '2',
    date: '10/03/2023',
    studentObservations: 'Did great, made a lot of progress!',
    studentNextSteps: 'Cell',
    coachObservations: 'Cell',
    coachNextSteps: 'Cell',
  },
  {
    key: '3',
    date: '10/02/2023',
    studentObservations: 'Practiced reading comprehension.',
    studentNextSteps: 'Struggled with longer sentences.',
    coachObservations: 'Cell',
    coachNextSteps: 'Cell',
  },
];

/**
 * A page only accessible to admins that displays all users in a table and allows
 * Admin to delete users from admin and promote users to admin.
 */
function AdminAddBlockPage() {
  const [day, setDay] = useState('');
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [blockNumber, setBlockNumber] = useState('');
  const [zoom, setZoom] = useState('');
  const [teachers, setTeachers] = useState<IUser[]>([]);
  const [coaches, setCoaches] = useState([]);
  const [students, setStudents] = useState([]);
  const [teacher, setTeacher] = useState<IUser | null>(null);

  const [pairs, setPairs] = useState<[IUser | null, IStudent | null][]>([
    [null, null],
  ]);

  const [error, setError] = useState(false);

  const users = useData('admin/all');
  const studentList = useData('student/all');

  useEffect(() => {
    const data = users?.data || [];
    setTeachers(data.filter((user: IUser) => user.role === 'teacher'));
    setCoaches(data.filter((user: IUser) => user.role === 'coach'));
  }, [users]);

  useEffect(() => {
    setStudents(studentList?.data || []);
  }, [studentList]);

  const handleDayChange = (event: SelectChangeEvent) => {
    setDay(event.target.value as string);
  };

  const handleNameChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setName(event.target.value as string);
  };

  const handleStartTimeChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setStartTime(event.target.value as string);
  };

  const handleEndTimeChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    console.log(endTime);
    setEndTime(event.target.value as string);
  };

  const handleBlockNumberChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setBlockNumber(event.target.value as string);
  };

  const handleZoomChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setZoom(event.target.value as string);
  };

  const displayName = (user: IUser) => {
    return `${user.firstName} ${user.lastName}`;
  };

  const handleDeleteRow = (index: number) => {
    if (pairs.length === 1) {
      setPairs([[null, null]]);
      return;
    }
    setPairs((prev) => [...prev.slice(0, index), ...prev.slice(index + 1)]);
  };

  const handleSubmit = () => {
    if (
      !day ||
      !name ||
      !startTime ||
      !endTime ||
      !blockNumber ||
      !zoom ||
      !teacher
    ) {
      setError(true);
    }
    addBlock({
      day,
      name,
      startTime,
      endTime,
      block: Number(blockNumber),
      zoom,
      teacher,
      pairs,
    });
  };

  return (
    <div>
      <Header />
      <ScreenGrid>
        <Typography variant="h4">Add Block</Typography>
        <FormGrid>
          <FormCol>
            <Grid item width="1">
              <Typography variant="subtitle1">Day</Typography>
              <Select
                value={day}
                label="Day"
                fullWidth
                onChange={handleDayChange}
              >
                <MenuItem value="Sunday">Sunday</MenuItem>
                <MenuItem value="Monday">Monday</MenuItem>
                <MenuItem value="Tuesday">Tuesday</MenuItem>
                <MenuItem value="Wednesday">Wednesday</MenuItem>
                <MenuItem value="Thursday">Thursday</MenuItem>
                <MenuItem value="Friday">Friday</MenuItem>
                <MenuItem value="Saturday">Saturday</MenuItem>
              </Select>
            </Grid>
            <Grid item width="1">
              <TextField
                fullWidth
                value={name}
                onChange={handleNameChange}
                label="Name"
                required
                variant="standard"
                placeholder="Name"
              />
            </Grid>
            <Grid item width="1">
              <Typography variant="subtitle1">Start Time</Typography>
              <TextField
                fullWidth
                value={startTime}
                onChange={handleStartTimeChange}
                type="time"
                variant="standard"
                required
              />
            </Grid>
            <Grid item width="1">
              <Typography variant="subtitle1">End Time</Typography>
              <TextField
                fullWidth
                value={endTime}
                onChange={handleEndTimeChange}
                type="time"
                variant="standard"
                required
              />
            </Grid>
            <Grid item width="1">
              <TextField
                fullWidth
                value={blockNumber}
                onChange={handleBlockNumberChange}
                label="Block number"
                required
                variant="standard"
                placeholder="Block number"
              />
            </Grid>
            <Grid item width="1">
              <TextField
                fullWidth
                value={zoom}
                onChange={handleZoomChange}
                label="Zoom link"
                variant="standard"
                placeholder="Zoom link"
              />
            </Grid>
            <Grid item width="1" marginBottom="1">
              <Autocomplete
                disablePortal
                id="teacher-dropdown"
                onChange={(event: any, newValue: string | null) => {
                  setTeacher(
                    teachers.find(
                      (person: IUser) =>
                        `${person.firstName} ${person.lastName}` ===
                        (newValue || ''),
                    ) || null,
                  );
                }}
                options={teachers.map((user: IUser) => displayName(user))}
                renderInput={(params) => (
                  /* eslint-disable react/jsx-props-no-spreading */
                  <TextField {...params} label="Teacher" />
                )}
              />
            </Grid>
            {teacher && (
              <Grid item width="1">
                <Typography variant="h6">Pairs</Typography>
                {pairs.map((pair, index) => (
                  <Grid display="flex" flexDirection="row">
                    <Autocomplete
                      disablePortal
                      sx={{ width: '45%' }}
                      id={`coach-dropdown-${index}`}
                      options={coaches.map((coach: IUser) =>
                        displayName(coach),
                      )}
                      /* eslint no-underscore-dangle: 0 */
                      value={
                        pair[0] &&
                        coaches.find(
                          (coach: IUser) => coach._id === pair[0]?._id,
                        )
                      }
                      renderInput={(params) => (
                        /* eslint-disable react/jsx-props-no-spreading */
                        <TextField {...params} label="Coach" />
                      )}
                    />
                    <Autocomplete
                      disablePortal
                      sx={{ width: '45%' }}
                      id={`student-dropdown-${index}`}
                      options={students.filter(
                        /* eslint no-underscore-dangle: 0 */
                        (student: IStudent) =>
                          teacher._id in student.teacher_id,
                      )}
                      value={
                        pair[1] &&
                        teachers.find(
                          (person: IUser) => person._id === pair[1]?._id,
                        )
                      }
                      renderInput={(params) => (
                        /* eslint-disable react/jsx-props-no-spreading */
                        <TextField {...params} label="Student" />
                      )}
                    />
                    <Button
                      variant="outlined"
                      id={`coach-dropdown-${index}`}
                      onClick={() => handleDeleteRow(index)}
                      sx={{
                        backgroundColor: 'white',
                        borderColor: 'black',
                        '&:hover': {
                          backgroundColor: 'grey.200',
                        },
                        width: theme.spacing(20),
                      }}
                    >
                      Delete Entry
                    </Button>
                  </Grid>
                ))}
                <Button
                  variant="outlined"
                  onClick={() => setPairs((prev) => [...prev, [null, null]])}
                  sx={{
                    marginTop: '10px',
                    right: '0%',
                    backgroundColor: 'white',
                    borderColor: 'black',
                    '&:hover': {
                      backgroundColor: 'grey.200',
                    },
                    width: theme.spacing(20),
                  }}
                >
                  Add Entry
                </Button>
              </Grid>
            )}
            <Grid item container justifyContent="center">
              <PrimaryButton
                type="submit"
                variant="contained"
                onClick={handleSubmit}
              >
                Submit
              </PrimaryButton>
            </Grid>
            {error && (
              <Grid item container justifyContent="center">
                <Typography justifyContent="center" color="red">
                  Please fill out all fields
                </Typography>
              </Grid>
            )}
          </FormCol>
        </FormGrid>
      </ScreenGrid>
    </div>
  );
}

// function AdminAddBlockPage() {
//   const [tableData, setTableData] = useState(initialTableData);

//   const columns: TColumn[] = [
//     { id: 'date', label: 'Date' },
//     { id: 'studentObservations', label: 'Student Observations' },
//     { id: 'studentNextSteps', label: 'Student Next Steps' },
//     { id: 'coachObservations', label: 'Coach Observations' },
//     { id: 'coachNextSteps', label: 'Coach Next Steps' },
//   ];

//   // for the buttons
//   const handleDeleteEntry = () => {
//     if (tableData.length === 0) return;
//     const updatedTableData = tableData.slice(0, -1); // take out last one
//     setTableData(updatedTableData);
//   };

//   const handleAddEntry = () => {
//     const dummyData = {
//       key: 'dummyKey',
//       date: new Date().toLocaleDateString(),
//       studentObservations: 'Dummy Student Observations',
//       studentNextSteps: 'Dummy Student Next Steps',
//       coachObservations: 'Dummy Coach Observations',
//       coachNextSteps: 'Dummy Coach Next Steps',
//     };

//     setTableData([...tableData, dummyData]);
//   };

//   // Used to create the data type to create a row in the table
//   function createAdminAddBlockPage(
//     key: string,
//     date: string,
//     studentObservations: string,
//     studentNextSteps: string,
//     coachObservations: string,
//     coachNextSteps: string,
//   ): AdminAddBlockPage {
//     return {
//       key,
//       date,
//       studentObservations,
//       studentNextSteps,
//       coachObservations,
//       coachNextSteps,
//     };
//   }

//   return (
//     <div>
//       <Header />
//       <Box
//         sx={{
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           padding: theme.spacing(10),
//           marginTop: theme.spacing(6),
//           marginLeft: theme.spacing(6),
//           marginRight: theme.spacing(6),
//           minHeight: '80vh',
//         }}
//       >
//         <Box
//           sx={{
//             display: 'flex',
//             flexDirection: 'row',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             width: '80%',
//             position: 'relative',
//             paddingBottom: theme.spacing(1),
//           }}
//         >
//           <Typography
//             variant="h2"
//             sx={{
//               fontWeight: theme.typography.fontWeightBold,
//               position: 'absolute',
//               left: '50%',
//               transform: 'translateX(-50%)',
//             }}
//           >
//             Notes
//           </Typography>
//           <Button
//             variant="outlined"
//             onClick={handleDeleteEntry}
//             sx={{
//               position: 'absolute',
//               right: '15%',
//               backgroundColor: 'white',
//               borderColor: 'black',
//               '&:hover': {
//                 backgroundColor: 'grey.200',
//               },
//               width: theme.spacing(20),
//             }}
//           >
//             Delete Entry
//           </Button>
//           <Button
//             variant="outlined"
//             onClick={handleAddEntry}
//             sx={{
//               position: 'absolute',
//               right: '0%',
//               backgroundColor: 'white',
//               borderColor: 'black',
//               '&:hover': {
//                 backgroundColor: 'grey.200',
//               },
//               width: theme.spacing(20),
//             }}
//           >
//             Add Entry
//           </Button>
//         </Box>
//         <Box
//           sx={{
//             marginTop: theme.spacing(5),
//             width: '80%',
//             padding: theme.spacing(2),
//           }}
//         >
//           {tableData && (
//             <PaginationTable
//               rows={tableData.map((data) =>
//                 createAdminAddBlockPage(
//                   data.key,
//                   data.date,
//                   data.studentObservations,
//                   data.studentNextSteps,
//                   data.coachObservations,
//                   data.coachNextSteps,
//                 ),
//               )}
//               columns={columns}
//             />
//           )}
//         </Box>
//       </Box>
//     </div>
//   );
// }

export default AdminAddBlockPage;
