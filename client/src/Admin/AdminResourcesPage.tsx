import React, { useEffect, useState } from 'react';
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
import { CallMade } from '@mui/icons-material';
import { PaginationTable, TColumn } from '../components/PaginationTable';
import Header from '../components/PageHeader';
import { deleteData, postData, putData, useData } from '../util/api';
import theme from '../assets/theme';
import DeleteResourceDialog from './DeleteResourceDialog';
import AddResourceDialog from './AddResourceDialog';
import EditResourceDialog from './EditResourceDialog';

interface IAdminResourcesTable {
  titles: string[];
}

interface AdminResourceRow {
  key: string;
  title: string;
  description: string;
  type: string;
  link: React.ReactElement;
}

interface Resource {
  _id: string /* eslint no-underscore-dangle: 0 */;
  title: string;
  description: string;
  link: string;
  type: string;
}

function ResourceButton({ link }: { link: string }) {
  return (
    <Button
      variant="contained"
      endIcon={<CallMade />}
      onClick={() => {
        const newWindow = window.open(link, '_blank', 'noopener,noreferrer');
        if (newWindow) {
          newWindow.opener = null;
        }
      }}
    >
      View Resource
    </Button>
  );
}

function AdminResourcesPage() {
  const [tableData, setTableData] = useState<Resource[]>([]);
  const [filteredTableData, setFilteredTableData] = useState<Resource[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [resourceType, setResourceType] = useState<string[]>([]);
  const [deleteDateDialogOpen, setDeleteDateDialogOpen] =
    useState<boolean>(false);
  const [addResourceDialogOpen, setAddResourceDialogOpen] =
    useState<boolean>(false);
  const [editResourceDialogOpen, setEditResourceDialogOpen] =
    useState<boolean>(false);
  const [data, setData] = useState<IAdminResourcesTable>({
    titles: [] as string[],
  });

  const rawTableData = useData('resources/all');

  useEffect(() => {
    const newData = rawTableData?.data || [];
    setTableData(newData);
  }, [rawTableData]);

  const columns: TColumn[] = [
    { id: 'title', label: 'Title' },
    { id: 'description', label: 'Description' },
    { id: 'type', label: 'Type' },
    { id: 'link', label: 'Link' },
  ];

  // for the buttons
  const deleteResource = async (id: string) => {
    try {
      // updating local tableData very jank :')

      const updatedTableData = tableData.filter(
        (item) => item._id !== id /* eslint no-underscore-dangle: 0 */,
      );
      setTableData(updatedTableData);
      deleteData(`resources/${id}`);
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
      const newResource = {
        title,
        description,
        link,
        type,
      };
      const promise = await postData('resources/', newResource);
      const preTableData = [...tableData, promise.data];
      const sorted = preTableData.sort((a, b) =>
        a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1,
      );
      setTableData(sorted);
    } catch (error) {
      console.error('Error deleting date:', error);
    }
  };

  const editResource = async (
    id: string,
    title: string,
    description: string,
    link: string,
    type: string,
  ) => {
    try {
      const newResource = {
        title,
        description,
        link,
        type,
      };
      const promise = await putData(`resources/${id}`, newResource);
      const removed = tableData.filter((r: Resource) => r._id !== id);
      setTableData([promise.data, ...removed]);
    } catch (error) {
      console.error('Error deleting date:', error);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  function createAdminResourceRow(
    key: string,
    title: string,
    description: string,
    type: string,
    linkButton: React.ReactElement,
  ): AdminResourceRow {
    return {
      key,
      title,
      description,
      type,
      link: linkButton,
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
        ? tableData.filter((row: Resource) => resourceType.includes(row.type))
        : tableData;

    const filteredBySearch = searchTerm
      ? filteredByType.filter(
          (row: Resource) =>
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
        resources={tableData}
        deleteResource={deleteResource}
      />
      <AddResourceDialog
        open={addResourceDialogOpen}
        setOpen={() => setAddResourceDialogOpen(false)}
        addResource={addResource}
        resources={tableData}
      />
      <EditResourceDialog
        open={editResourceDialogOpen}
        setOpen={() => setEditResourceDialogOpen(false)}
        editResource={editResource}
        resources={tableData}
      />
      <Header />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: theme.spacing(10),
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
            width: '80%',
            padding: theme.spacing(2),
          }}
        >
          <Box
            sx={{
              paddingBottom: theme.spacing(2),
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'nowrap',
            }}
          >
            <Box sx={{ display: 'flex', flexBasis: '40%' }}>
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
                  sx={{
                    width: 150,
                    flexShrink: 100,
                  }}
                >
                  <MenuItem value="Video">Video</MenuItem>
                  <MenuItem value="Slides">Slides</MenuItem>
                  <MenuItem value="Article">Article</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'right',
                alignItems: 'center',
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
                  marginRight: theme.spacing(2),
                }}
              >
                Delete Entry
              </Button>
              <Button
                variant="outlined"
                onClick={() => setEditResourceDialogOpen(true)}
                sx={{
                  backgroundColor: 'white',
                  borderColor: 'black',
                  '&:hover': {
                    backgroundColor: 'grey.200',
                  },
                }}
              >
                Edit Entry
              </Button>
            </Box>
          </Box>
          {filteredTableData && (
            <PaginationTable
              rows={filteredTableData.map((resource) => {
                return createAdminResourceRow(
                  resource._id /* eslint no-underscore-dangle: 0 */,
                  resource.title,
                  resource.description,
                  resource.type,
                  <ResourceButton link={resource.link} />,
                );
              })}
              columns={columns}
            />
          )}
        </Box>
      </Box>
    </>
  );
}

export default AdminResourcesPage;
