import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { Button, Box, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate, useParams } from 'react-router-dom';
import { PaginationTable, TColumn } from '../components/PaginationTable';
import Header from '../components/PageHeader';
import { useData } from '../util/api';
import theme from '../assets/theme';
import ScreenGrid from '../components/ScreenGrid';
import AddDateNotesDialog from './AddDateNotesDialog';
import DeleteDateDialog from './DeleteDateDialog';

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

const initialTableData = [
  {
    key: '1',
    date: '10/5/2023',
    studentObservations: 'Worked on vowels today.',
    studentNextSteps: 'Maria was a little distracted...',
    coachObservations: 'Cell',
    coachNextSteps: 'Cell',
  },
  {
    key: '2',
    date: '10/3/2023',
    studentObservations: 'Did great, made a lot of progress!',
    studentNextSteps: 'Cell',
    coachObservations: 'Cell',
    coachNextSteps: 'Cell',
  },
  {
    key: '3',
    date: '10/2/2023',
    studentObservations: 'Practiced reading comprehension.',
    studentNextSteps: 'Struggled with longer sentences.',
    coachObservations: 'Cell',
    coachNextSteps: 'Cell',
  },
];

function AdminSessionsPage() {
  const { studentId } = useParams<{ studentId: string }>();
  const studentData = useData(`student/student/${studentId}`);
  const [student, setStudent] = useState(null);
  const [coach, setCoach] = useState(null);
  const [tableData, setTableData] = useState(initialTableData);
  const [dateDialogOpen, setDateDialogOpen] = useState<boolean>(false);
  const [deleteDateDialogOpen, setDeleteDateDialogOpen] =
    useState<boolean>(false);
  const [data, setData] = useState<IAdminNotesTable>({
    dates: [] as number[],
  });

  useEffect(() => {
    const rawStudentData = studentData?.data;
    console.log(rawStudentData);
    // rawStudentData.coach_id[0];
  }, [studentData]);

  useEffect(() => {
    const dates = tableData.map((item) => new Date(item.date).getTime());
    console.log(dates);
    setData((prevData) => ({ ...prevData, dates }));
  }, [tableData]);

  const columns: TColumn[] = [
    { id: 'date', label: 'Date' },
    { id: 'studentObservations', label: 'Student Observations' },
    { id: 'studentNextSteps', label: 'Student Next Steps' },
    { id: 'coachObservations', label: 'Coach Observations' },
    { id: 'coachNextSteps', label: 'Coach Next Steps' },
  ];

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

  const deleteDate = (date: number) => {
    try {
      // updating local tableData very jank :')
      const dateStr = new Date(date).toLocaleDateString('en-US');
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
      console.log(date);
      // updating local tableData very jank :')
      const dummyData = {
        key: 'dummyKey',
        date: new Date(date).toLocaleDateString('en-US'),
        studentObservations,
        studentNextSteps,
        coachObservations,
        coachNextSteps,
      };

      setTableData([...tableData, dummyData]);
    } catch (error) {
      console.error('Error deleting date:', error);
    }
  };

  return (
    <div>
      <AddDateNotesDialog
        open={dateDialogOpen}
        setOpen={() => setDateDialogOpen(false)}
        addDate={addDate}
      />
      <DeleteDateDialog
        open={deleteDateDialogOpen}
        setOpen={() => setDeleteDateDialogOpen(false)}
        options={data.dates}
        deleteDate={deleteDate}
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
            paddingBottom: theme.spacing(1),
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
            }}
          >
            Delete Entry
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
