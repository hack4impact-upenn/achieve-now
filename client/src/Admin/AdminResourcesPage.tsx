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
import { PaginationTable, TColumn } from '../components/PaginationTable';
import Header from '../components/PageHeader';
import { useData } from '../util/api';
import theme from '../assets/theme';
import ScreenGrid from '../components/ScreenGrid';
import DeleteResourceDialog from './DeleteResourceDialog';
import AddResourceDialog from './AddResourceDialog';

interface IAdminResourcesTable {
  titles: string[];
}

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
    title: 'test1',
    description: 'desc',
    link: 'http:google.com',
    type: 'Video',
  },
  {
    key: '2',
    title: 'test2',
    description: 'desc',
    link: 'http:google.com',
    type: 'Slides',
  },
  {
    key: '3',
    title: 'test3',
    description: 'desc',
    link: 'http:google.com',
    type: 'Article',
  },
  {
    key: '4',
    title: 'test4',
    description: 'desc',
    link: 'http:google.com',
    type: 'Video',
  },
];

function AdminResourcesPage() {
  const [tableData, setTableData] = useState(initialTableData);
  const [filteredTableData, setFilteredTableData] = useState(initialTableData);
  const [searchTerm, setSearchTerm] = useState('');
  const [resourceType, setResourceType] = useState<string[]>([]);
  const [deleteDateDialogOpen, setDeleteDateDialogOpen] =
    useState<boolean>(false);
  const [addResourceDialogOpen, setAddResourceDialogOpen] =
    useState<boolean>(false);
  const [data, setData] = useState<IAdminResourcesTable>({
    titles: [] as string[],
  });

  const columns: TColumn[] = [
    { id: 'title', label: 'Title' },
    { id: 'description', label: 'Description' },
    { id: 'link', label: 'Link' },
    { id: 'type', label: 'Type' },
  ];

  // for the buttons
  const deleteResource = async (r: string) => {
    try {
      // updating local tableData very jank :')
      const title = r;
      const updatedTableData = tableData.filter((item) => item.title !== r);

      setTableData(updatedTableData);
    } catch (error) {
      console.error('Error deleting date:', error);
    }
  };

  const addResource = async (
    title: string,
    description: string,
    link: string,
    type: string,
  ) => {
    try {
      // updating local tableData very jank :')
      const dummyData = {
        key: Date.now().toString(),
        title,
        description,
        link,
        type,
      };

      setTableData([...tableData, dummyData]);
    } catch (error) {
      console.error('Error deleting date:', error);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
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

  const selectChangeHandler = (e: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = e;
    setResourceType(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  useEffect(() => {
    const titles = tableData.map((item) => item.title);
    setData((prevData) => ({ ...prevData, titles }));

    const filteredByType =
      resourceType.length !== 0
        ? tableData.filter((row: AdminResourcesRow) =>
            resourceType.includes(row.type),
          )
        : tableData;

    const filteredBySearch = searchTerm
      ? filteredByType.filter(
          (row: AdminResourcesRow) =>
            row.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.description.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      : filteredByType;

    setFilteredTableData(filteredBySearch);
  }, [resourceType, tableData, searchTerm]);

  return (
    <>
      <DeleteResourceDialog
        open={deleteDateDialogOpen}
        setOpen={() => setDeleteDateDialogOpen(false)}
        options={data.titles}
        deleteResource={deleteResource}
      />
      <AddResourceDialog
        open={addResourceDialogOpen}
        setOpen={() => setAddResourceDialogOpen(false)}
        addResource={addResource}
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
            onClick={() => setAddResourceDialogOpen(true)}
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
            // onClick={handleDeleteEntry}
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
          <Box sx={{ paddingBottom: theme.spacing(2) }}>
            <FormControl
              variant="outlined"
              sx={{
                marginRight: theme.spacing(2),
              }}
            >
              <InputLabel htmlFor="search-field">Search</InputLabel>
              <OutlinedInput
                id="search-field"
                value={searchTerm}
                onChange={handleSearchChange}
                label="Search"
              />
            </FormControl>

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
              rows={filteredTableData.map((resourceData) =>
                createAdminResourcesRow(
                  resourceData.key,
                  resourceData.title,
                  resourceData.description,
                  resourceData.link,
                  resourceData.type,
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
    </>
  );
}

export default AdminResourcesPage;
