import React, { useEffect, useState, useMemo } from 'react';
import { Button, Box, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { PaginationTable, TColumn } from '../components/PaginationTable';
import Header from '../components/PageHeader';
import { deleteData, getData, putData, useData } from '../util/api';
import theme from '../assets/theme';
import AddDateNotesDialog from './AddDateNotesDialog';
import DeleteDateDialog from './DeleteDateNotesDialog';
import EditDateDialog from './EditDateNotesDialog';
import IStudent from '../util/types/student';
import ICoach from '../util/types/coach';

interface IAdminNotesTable {
  dates: number[];
}

interface IAdminNotesRow {
  key: string;
  date: string;
  studentObservations: string;
  studentNextSteps: string;
  coachObservations: string;
  coachNextSteps: string;
}

function AdminSessionsPage() {
  const { studentId } = useParams<{ studentId: string }>();
  const studentData = useData(`student/student/${studentId}`);
  const [student, setStudent] = useState<IStudent | null>(null);
  const [coach, setCoach] = useState<ICoach | null>(null);
  const [tableData, setTableData] = useState<IAdminNotesRow[]>([]);
  const [dateDialogOpen, setDateDialogOpen] = useState<boolean>(false);
  const [deleteDateDialogOpen, setDeleteDateDialogOpen] =
    useState<boolean>(false);
  const [editDateDialogOpen, setEditDateDialogOpen] = useState<boolean>(false);
  const [data, setData] = useState<IAdminNotesTable>({
    dates: [] as number[],
  });

  useEffect(() => {
    const dates = tableData.map((item) => Number(new Date(item.date)));
    setData((prevData) => ({ ...prevData, dates }));
  }, [tableData]);

  const columns: TColumn[] = [
    { id: 'date', label: 'Date' },
    { id: 'studentObservations', label: 'Student Observations' },
    { id: 'studentNextSteps', label: 'Student Next Steps' },
    { id: 'coachObservations', label: 'Coach Observations' },
    { id: 'coachNextSteps', label: 'Coach Next Steps' },
  ];

  async function getCoach(id: string) {
    // stored coach_id is the user_id of the coach not the id
    const res = await getData(`coach/${id}`);
    if (!res.error) {
      setCoach(res.data);
    }
  }

  useEffect(() => {
    const rawStudentData = studentData?.data;
    if (rawStudentData) {
      setStudent(rawStudentData);
      if (rawStudentData.coach_id && rawStudentData.coach_id.length >= 1) {
        getCoach(rawStudentData.coach_id[0]);
      }
    }
  }, [studentData]);

  useEffect(() => {
    const bigMap = new Map();
    if (student) {
      console.log(student.progress_stats);
      Object.entries(student.progress_stats).forEach(([key, innerMap]) => {
        if (key === 'student_next_steps' || key === 'student_observations') {
          Object.entries(innerMap).forEach(([date, comments]) => {
            if (!bigMap.has(date)) {
              bigMap.set(date, {});
            }
            bigMap.get(date)[key] = comments;
          });
        }
      });
    }

    if (coach) {
      Object.entries(coach.progress_stats).forEach(([key, innerMap]) => {
        if (key === 'coach_next_steps' || key === 'coach_observations') {
          Object.entries(innerMap).forEach(([date, comments]) => {
            if (!bigMap.has(date)) {
              bigMap.set(date, {});
            }
            bigMap.get(date)[key] = comments;
          });
        }
      });
    }

    const bigTable: IAdminNotesRow[] = [];
    Array.from(bigMap.entries()).forEach(([date, obj], index) => {
      bigTable.push({
        key: date.toString(),
        date: new Date(parseInt(date, 10)).toLocaleDateString(),
        studentObservations: obj.student_observations || '',
        studentNextSteps: obj.student_next_steps || '',
        coachObservations: obj.coach_observations || '',
        coachNextSteps: obj.coach_next_steps || '',
      });
    });
    setTableData(bigTable);
  }, [student, coach]);

  // Used to create the data type to create a row in the table
  function createAdminNotesRow(
    key: string,
    date: string,
    studentObservations: string,
    studentNextSteps: string,
    coachObservations: string,
    coachNextSteps: string,
  ): IAdminNotesRow {
    return {
      key,
      date,
      studentObservations,
      studentNextSteps,
      coachObservations,
      coachNextSteps,
    };
  }

  const deleteDate = async (date: number) => {
    try {
      deleteData(
        `student/progress/${student?._id}/${date}`,
      ); /* eslint no-underscore-dangle: 0 */

      if (coach) {
        deleteData(
          `coach/progress/${coach._id}/${date}`,
        ); /* eslint no-underscore-dangle: 0 */
      }

      const dateStr = new Date(date).toLocaleDateString();
      const updatedTableData = tableData.filter(
        (item) => item.date !== dateStr,
      );

      setTableData(updatedTableData);
    } catch (error) {
      console.error('Error deleting date:', error);
    }
  };

  const addDate = async (
    date: number,
    studentObservations: string,
    studentNextSteps: string,
    coachObservations: string,
    coachNextSteps: string,
  ) => {
    try {
      const studentComments = {
        date,
        observations: studentObservations,
        next_steps: studentNextSteps,
      };
      putData(
        `student/progress/${student?._id}`,
        studentComments,
      ); /* eslint no-underscore-dangle: 0 */

      if (coach) {
        const coachComments = {
          date,
          observations: coachObservations,
          next_steps: coachNextSteps,
        };
        putData(
          `coach/progress/${coach?._id}`,
          coachComments,
        ); /* eslint no-underscore-dangle: 0 */
      }

      const newData = {
        key: date.toString(),
        date: new Date(date).toLocaleDateString('en-US'),
        studentObservations,
        studentNextSteps,
        coachObservations,
        coachNextSteps,
      };

      const oldData = tableData.filter((notesRow: IAdminNotesRow) => {
        return notesRow.key !== newData.key;
      });
      setTableData([newData, ...oldData]);
    } catch (error) {
      console.error('Error deleting date:', error);
    }
  };

  const sortedDates = useMemo(() => data.dates.sort((a, b) => b - a), [data]);

  return (
    <div>
      <AddDateNotesDialog
        open={dateDialogOpen}
        setOpen={() => setDateDialogOpen(false)}
        addDate={addDate}
        table={tableData}
      />
      <DeleteDateDialog
        open={deleteDateDialogOpen}
        setOpen={() => setDeleteDateDialogOpen(false)}
        options={sortedDates}
        deleteDate={deleteDate}
      />
      <EditDateDialog
        open={editDateDialogOpen}
        setOpen={() => setEditDateDialogOpen(false)}
        options={sortedDates}
        editDate={addDate}
        table={tableData}
      />
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
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '80%',
            position: 'relative',
            paddingBottom: theme.spacing(3),
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: theme.typography.fontWeightBold,
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            Notes
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'right',
            width: '80%',
            padding: `0 ${theme.spacing(2)}`,
          }}
        >
          <Button
            variant="outlined"
            onClick={() => setDateDialogOpen(true)}
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
            Add Entry
          </Button>
          <Button
            variant="outlined"
            onClick={() => setDeleteDateDialogOpen(true)}
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
            Delete Entry
          </Button>
          <Button
            variant="outlined"
            onClick={() => setEditDateDialogOpen(true)}
            sx={{
              backgroundColor: 'white',
              borderColor: 'black',
              '&:hover': {
                backgroundColor: 'grey.200',
              },
              width: theme.spacing(20),
            }}
          >
            Edit Entry
          </Button>
        </Box>

        <Box
          sx={{
            width: '80%',
            padding: theme.spacing(2),
          }}
        >
          {tableData && (
            <PaginationTable
              rows={tableData.map((rowData) =>
                createAdminNotesRow(
                  rowData.key,
                  rowData.date,
                  rowData.studentObservations,
                  rowData.studentNextSteps,
                  rowData.coachObservations,
                  rowData.coachNextSteps,
                ),
              )}
              columns={columns}
            />
          )}
        </Box>
      </Box>
    </div>
  );
}

export default AdminSessionsPage;
