import React, { useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import { Button, Box, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useParams, useNavigate } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Modal from '@mui/material/Modal';
import { PaginationTable, TColumn } from '../components/PaginationTable';
import Header from '../components/PageHeader';
import { useData, putData, getData } from '../util/api';
import theme from '../assets/theme';
import ScreenGrid from '../components/ScreenGrid';
import LessonLevels from '../components/LessonLevels';
import useAlert from '../util/hooks/useAlert';
import AlertType from '../util/types/alert';
import { getLessonStringFromLessonLevel } from '../util/lessonLevels';

interface AdminDashboardRow {
  key: string;
  student: string;
  coach: string;
  nextSteps: React.ReactElement;
  lessonNumber: React.ReactElement;
}

interface BlockInfo {
  key: string;
  students: [string];
  day: string;
  startTime: string;
  endTime: string;
  name: string;
  zoom: string;
  // Add other properties if needed
}

interface StudentInfo {
  id: string;
  studentId: string;
  name: string;
  coach: string;
  nextStep: string;
  lessonLevel: string;
}

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

function AdminBlockPage() {
  const params = useParams();
  const blockID = params.id;
  const navigate = useNavigate();

  const columns: TColumn[] = [
    { id: 'student', label: 'Student' },
    { id: 'coach', label: 'Coach' },
    { id: 'nextSteps', label: 'Next Steps' },
    { id: 'lessonNumber', label: 'Lesson Number' },
  ];

  // State for table data
  const [tableData, setTableData] = useState<BlockInfo>();
  const [studentData, setStudentData] = useState<StudentInfo[]>([]);
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);

  const [openConfirmationModal, setOpenConfirmationModal] =
    React.useState(false);
  const handleOpenConfirmationModal = () => setOpenConfirmationModal(true);
  const handleCloseConfirmationModal = () => setOpenConfirmationModal(false);

  const { setAlert } = useAlert();

  // Fetch data from the backend
  const getStudentAndCoach = (studentID: string) => {
    try {
      axios
        .get(`http://localhost:4000/api/student/student/${studentID}`)
        .then((res) => {
          // eslint-disable-next-line no-underscore-dangle
          if (!res.data._id) {
            throw new Error('No Student Found');
          }
          return axios.all([
            axios.get(
              `http://localhost:4000/api/lesson/${res.data.lesson_level}`,
            ),
            axios.get(
              `http://localhost:4000/api/user/id/${res.data.coach_id[0]}`,
            ),
            axios.get(`http://localhost:4000/api/user/id/${res.data.user_id}`),
          ]);
        })
        .then(
          axios.spread((lesson, coach, studentUser) => {
            const lessonNumber = lesson ? lesson.data.number : 0;
            const studentInfo: StudentInfo = {
              // eslint-disable-next-line no-underscore-dangle
              id: studentUser.data._id,
              studentId: studentID,
              name: `${studentUser.data.firstName} ${studentUser.data.lastName}`,
              coach: `${coach.data.firstName} ${coach.data.lastName}`,
              lessonLevel: lessonNumber,
              nextStep: 'next step',
            };
            setStudentData((prevStudentData) => [
              ...prevStudentData,
              studentInfo,
            ]);
          }),
        )
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log('Invalid Student');
    }
  };

  useEffect(() => {
    // assumming the block id is known / fetched from elsewhere
    setStudentData([]);
    axios
      .get(`http://localhost:4000/api/block/block-info-id/${blockID}`)
      .then((response) => {
        setTableData(response.data);
        response.data.students.forEach((student: string) => {
          getStudentAndCoach(student);
        });
      })
      .catch((error) => {
        console.error('Error fetching block info:', error);
      });
  }, [blockID]);

  // for the button
  const handleEditBlock = () => {
    // todo add functionality
    navigate(`/admin/edit-block/${blockID}`);
  };

  const handleDeleteBlock = async () => {
    try {
      setAlert('Block Delete Successfully!', AlertType.SUCCESS);
      await putData(`block/delete-block`, { id: blockID });
      navigate('/admin/sessions');
    } catch (error) {
      setAlert('Error Deleting Block', AlertType.ERROR);
    }
  };

  const updateLessonLevel = async (id: string, lessonLevel: string) => {
    try {
      getData(`lesson/getLesson/${lessonLevel}`).then((data) => {
        try {
          putData('student/update-lesson-level', {
            id,
            // eslint-disable-next-line no-underscore-dangle
            lessonLevel: data.data._id,
          }).then(() => {
            const studentDataCopy = studentData;
            let name = '';
            studentDataCopy
              .filter((r) => r.studentId === id)
              .forEach((v) => {
                name = v.name;
                // eslint-disable-next-line no-param-reassign
                v.lessonLevel = lessonLevel;
              });
            setStudentData(studentDataCopy);
            forceUpdate();
            setAlert(
              `Updated Lesson Number for ${name} to ${lessonLevel}`,
              AlertType.SUCCESS,
            );
          });
        } catch (error) {
          setAlert(
            `Lesson Number ${lessonLevel} does not exist.`,
            AlertType.ERROR,
          );
        }
      });
    } catch (error) {
      console.log('Could Not find Lesson with that level number');
    }
  };
  // Used to create the data type to create a row in the table
  function createAdminSessionsRow(
    _id: string,
    student: string,
    coach: string,
    nextSteps: React.ReactElement,
    lessonNumber: React.ReactElement,
  ): AdminDashboardRow {
    return {
      key: _id,
      student,
      coach,
      nextSteps,
      lessonNumber,
    };
  }

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
            flexDirection: 'column', // Changed from 'row' to 'column'
            alignItems: 'center',
            width: '80%',
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: theme.typography.fontWeightBold,
              marginBottom: theme.spacing(1), // Added margin bottom
            }}
          >
            {tableData?.day} {tableData?.startTime} - {tableData?.endTime}:{' '}
            {tableData?.name}
          </Typography>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              width: '100%',
            }}
          >
            <Button
              variant="outlined"
              onClick={handleOpenConfirmationModal}
              sx={{
                backgroundColor: 'white',
                borderColor: 'black',
                '&:hover': {
                  backgroundColor: 'grey.200',
                },
                width: theme.spacing(20),
                marginRight: theme.spacing(2),
              }}
            >
              Delete Block
            </Button>
            <Button
              variant="outlined"
              onClick={handleEditBlock}
              sx={{
                backgroundColor: 'white',
                borderColor: 'black',
                '&:hover': {
                  backgroundColor: 'grey.200',
                },
                width: theme.spacing(20),
              }}
            >
              Edit Block
            </Button>
          </div>
        </Box>

        <Box
          sx={{
            marginTop: theme.spacing(5),
            width: '80%',
            padding: theme.spacing(2),
          }}
        >
          {tableData && (
            <PaginationTable
              rows={studentData.map(
                (
                  student: StudentInfo, // Explicitly type the data parameter
                ) =>
                  createAdminSessionsRow(
                    student.id,
                    student.name,
                    student.coach,
                    <a
                      href={`/admin/notes/${student.studentId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Notes
                    </a>,
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Lesson Number
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={student.lessonLevel}
                        label="Lesson Number"
                        onChange={(e: SelectChangeEvent) =>
                          updateLessonLevel(student.studentId, e.target.value)
                        }
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 48 * 4.5 + 8,
                              width: '20ch',
                            },
                          },
                        }}
                      >
                        {[...Array(62)].map((__, i) => (
                          <MenuItem value={`${i + 1}`} id={student.id}>
                            {getLessonStringFromLessonLevel(i + 1)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>,
                  ),
              )}
              columns={columns}
            />
          )}
        </Box>
      </Box>
      <div>
        <Button onClick={handleOpenConfirmationModal}>Open modal</Button>
        <Modal
          open={openConfirmationModal}
          onClose={handleCloseConfirmationModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Are you sure you want to delete this session?
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              This will delete the session and its associated data.
            </Typography>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: '30px',
              }}
            >
              <Button
                variant="contained"
                sx={{ marginRight: '5px' }}
                onClick={handleCloseConfirmationModal}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteBlock}
              >
                Delete
              </Button>
            </div>
          </Box>
        </Modal>
      </div>
    </div>
  );
}

export default AdminBlockPage;
