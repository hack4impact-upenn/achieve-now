import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Box, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { PaginationTable, TColumn } from '../components/PaginationTable';
import Header from '../components/PageHeader';
import theme from '../assets/theme';
import ScreenGrid from '../components/ScreenGrid';

interface AdminDashboardRow {
  key: string;
  student: string;
  coach: string;
  nextSteps: React.ReactElement;
}

function AdminSessionsPage() {
  const columns: TColumn[] = [
    { id: 'student', label: 'Student' },
    { id: 'coach', label: 'Coach' },
    { id: 'nextSteps', label: 'Next Steps' },
  ];

  // Used to create the data type to create a row in the table
  function createAdminSessionsRow(
    _id: string,
    student: string,
    coach: string,
    nextSteps: React.ReactElement,
  ): AdminDashboardRow {
    return {
      key: _id,
      student,
      coach,
      nextSteps,
    };
  }

  // dummy data
  const tableData = [
    { key: '1', student: 'Mary', coach: 'John' },
    // ... other data rows ...
  ];

  // if the userlist is not yet populated, display a loading spinner
  if (!tableData) {
    return (
      <div style={{ width: '0', margin: 'auto' }}>
        <CircularProgress size={80} />
      </div>
    );
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
            Monday 8:50 - 9:50: Block 1
          </Typography>
          <Button
            variant="outlined"
            sx={{
              position: 'absolute',
              right: '0%',
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
        </Box>

        <Box
          sx={{
            marginTop: theme.spacing(5),
            width: '80%',
            padding: theme.spacing(2),
          }}
        >
          <PaginationTable
            rows={tableData.map((data) =>
              createAdminSessionsRow(
                data.key,
                data.student,
                data.coach,
                <a href="../users" target="_blank" rel="noopener noreferrer">
                  Notes
                </a>,
              ),
            )}
            columns={columns}
          />
        </Box>
      </Box>
    </div>
  );
}

export default AdminSessionsPage;
