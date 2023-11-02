import React, { useState } from 'react';
import axios from 'axios';
import { Button, Box, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { PaginationTable, TColumn } from '../components/PaginationTable';
import Header from '../components/PageHeader';
import { useData } from '../util/api';
import theme from '../assets/theme';
import ScreenGrid from '../components/ScreenGrid';

interface AdminNotesRow {
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

function AdminSessionsPage() {
  const [tableData, setTableData] = useState(initialTableData);

  const columns: TColumn[] = [
    { id: 'date', label: 'Date' },
    { id: 'studentObservations', label: 'Student Observations' },
    { id: 'studentNextSteps', label: 'Student Next Steps' },
    { id: 'coachObservations', label: 'Coach Observations' },
    { id: 'coachNextSteps', label: 'Coach Next Steps' },
  ];

  // for the buttons
  const handleDeleteEntry = () => {
    if (tableData.length === 0) return;
    const updatedTableData = tableData.slice(0, -1); // take out last one
    setTableData(updatedTableData);
  };

  const handleAddEntry = () => {
    const dummyData = {
      key: 'dummyKey',
      date: new Date().toLocaleDateString(),
      studentObservations: 'Dummy Student Observations',
      studentNextSteps: 'Dummy Student Next Steps',
      coachObservations: 'Dummy Coach Observations',
      coachNextSteps: 'Dummy Coach Next Steps',
    };

    setTableData([...tableData, dummyData]);
  };

  // Used to create the data type to create a row in the table
  function createAdminNotesRow(
    key: string,
    date: string,
    studentObservations: string,
    studentNextSteps: string,
    coachObservations: string,
    coachNextSteps: string,
  ): AdminNotesRow {
    return {
      key,
      date,
      studentObservations,
      studentNextSteps,
      coachObservations,
      coachNextSteps,
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
            onClick={handleAddEntry}
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
            onClick={handleDeleteEntry}
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
              rows={tableData.map((data) =>
                createAdminNotesRow(
                  data.key,
                  data.date,
                  data.studentObservations,
                  data.studentNextSteps,
                  data.coachObservations,
                  data.coachNextSteps,
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
