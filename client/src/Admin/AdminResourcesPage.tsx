import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button,
  Box,
  Typography,
  Select,
  MenuItem,
  SelectChangeEvent,
  OutlinedInput,
  InputLabel,
  FormControl,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { PaginationTable, TColumn } from '../components/PaginationTable';
import Header from '../components/PageHeader';
import { useData } from '../util/api';
import theme from '../assets/theme';
import ScreenGrid from '../components/ScreenGrid';

interface AdminResourcesRow {
  key: string;
  title: string;
  description: string;
  link: string;
  type: string;
}

const initialTableData = [
  {
    key: '1',
    title: 'Test',
    description: 'desc',
    link: 'http:google.com',
    type: 'Video',
  },
  {
    key: '2',
    title: 'Test',
    description: 'desc',
    link: 'http:google.com',
    type: 'Slides',
  },
  {
    key: '3',
    title: 'Test',
    description: 'desc',
    link: 'http:google.com',
    type: 'Article',
  },
  {
    key: '4',
    title: 'Test',
    description: 'desc',
    link: 'http:google.com',
    type: 'Video',
  },
];

function AdminResourcesPage() {
  const [tableData, setTableData] = useState(initialTableData);
  const [filteredTableData, setFilteredTableData] = useState(initialTableData);

  const [resourceType, setResourceType] = useState<string[]>([]);

  const columns: TColumn[] = [
    { id: 'title', label: 'Title' },
    { id: 'description', label: 'Description' },
    { id: 'link', label: 'Link' },
    { id: 'type', label: 'Type' },
  ];

  // for the buttons
  const handleDeleteEntry = () => {
    if (tableData.length === 0) return;
    const updatedTableData = tableData.slice(0, -1); // take out last one
    setTableData(updatedTableData);
  };

  const handleAddEntry = () => {
    const dummyData = {
      key: Date.now().toString(),
      title: 'Dummy Test',
      description: 'Dummy desc',
      link: 'Dummy link',
      type: 'Video',
    };

    setTableData([...tableData, dummyData]);
  };

  // Used to create the data type to create a row in the table
  function createAdminResourcesRow(
    key: string,
    title: string,
    description: string,
    link: string,
    type: string,
  ): AdminResourcesRow {
    return {
      key,
      title,
      description,
      link,
      type,
    };
  }

  useEffect(() => {
    if (resourceType.length !== 0) {
      setFilteredTableData(
        tableData.filter((row: AdminResourcesRow) =>
          resourceType.includes(row.type),
        ),
      );
    } else {
      setFilteredTableData(tableData);
    }
  }, [resourceType, tableData]);
  const selectChangeHandler = (e: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = e;
    setResourceType(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

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
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: theme.typography.fontWeightBold,
              margin: 'auto',
            }}
          >
            Resources
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
          <Box sx={{ paddingBottom: theme.spacing(2) }}>
            <FormControl>
              <InputLabel id="resource-type-label">Type</InputLabel>
              <Select
                labelId="resource-type-label"
                multiple
                value={resourceType}
                onChange={selectChangeHandler}
                input={<OutlinedInput label="Type" />}
                sx={{ width: 200 }}
              >
                <MenuItem value="Video">Video</MenuItem>
                <MenuItem value="Slides">Slides</MenuItem>
                <MenuItem value="Article">Article</MenuItem>
              </Select>
            </FormControl>
          </Box>
          {filteredTableData && (
            <PaginationTable
              rows={filteredTableData.map((data) =>
                createAdminResourcesRow(
                  data.key,
                  data.title,
                  data.description,
                  data.link,
                  data.type,
                ),
              )}
              columns={columns}
            />
          )}
        </Box>
        <Button variant="outlined" sx={{ marginTop: theme.spacing(2) }}>
          Submit
        </Button>
      </Box>
    </div>
  );
}

export default AdminResourcesPage;
