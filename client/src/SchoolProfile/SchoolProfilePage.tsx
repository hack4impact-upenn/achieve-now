/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import { Typography, Grid } from '@mui/material';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import ScreenGrid from '../components/ScreenGrid';
import AddSchoolDialog from './AddSchoolDialog';
import DeleteSchoolDialog from './DeleteSchoolDialog';
import EditSchoolDialog from './EditSchoolDialog';
import { useData, postData, putData, URLPREFIX } from '../util/api';
import ISchool from '../util/types/school';
import Header from '../components/PageHeader';
import { selectUser } from '../util/redux/userSlice';
import { useAppSelector } from '../util/redux/hooks';
import { PaginationTable, TColumn } from '../components/PaginationTable';

interface SchoolDashboardRow {
  key: string;
  name: string;
  teachers: string;
  info: string;
  admin_name: string;
  admin_content: string;
  calendar_link: React.ReactElement;
  school_start_time: string;
  school_end_time: string;
  first_grade_lunch_start_time: string;
  first_grade_lunch_end_time: string;
  second_grade_lunch_start_time: string;
  second_grade_lunch_end_time: string;
}

function SchoolProfilePage() {
  const formatTime = (time: Date | null | string): string => {
    if (time instanceof Date) {
      return `${time.getHours().toString().padStart(2, '0')}:${time
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;
      // eslint-disable-next-line
    } else if (typeof time === 'string') {
      // Assuming the string is in a valid date format, you may need to adjust this based on your data
      const date = new Date(time);
      return `${date.getHours().toString().padStart(2, '0')}:${date
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;
    }
    return '';
  };

  // define columns for the table
  const columns: TColumn[] = [
    { id: 'name', label: 'Name' },
    { id: 'teachers', label: 'Teachers' },
    { id: 'info', label: 'Info' },
    { id: 'admin_name', label: 'Admin Name' },
    { id: 'admin_content', label: 'Admin Content' },
    { id: 'calendar_link', label: 'Calendar Link' },
    { id: 'school_start_time', label: 'School Start Time' },
    { id: 'school_end_time', label: 'School End Time' },
    {
      id: 'first_grade_lunch_start_time',
      label: 'First Grade Lunch Start Time',
    },
    { id: 'first_grade_lunch_end_time', label: 'First Grade Lunch End Time' },
    {
      id: 'second_grade_lunch_start_time',
      label: 'Second Grade Lunch Start Time',
    },
    { id: 'second_grade_lunch_end_time', label: 'Second Grade Lunch End Time' },
  ];

  // Used to create the data type to create a row in the table
  async function createAdminDashboardRow(school: ISchool) {
    const {
      _id,
      name,
      teachers,
      info,
      admin_name,
      admin_content,
      calendar_link,
      school_start_time,
      school_end_time,
      first_grade_lunch_start_time,
      first_grade_lunch_end_time,
      second_grade_lunch_start_time,
      second_grade_lunch_end_time,
    } = school;

    // Fetch teacher details for all teacherIds
    const teacherPromises = teachers.map((teacherId) =>
      axios.get(`${URLPREFIX}/user/id/${teacherId}`),
    );

    // Use Promise.all to wait for all requests to complete
    const teacherResponses = await Promise.all(teacherPromises);

    // Extract firstName from each response
    const teacherNames = teacherResponses.map(
      (response) => `${response.data.firstName} ${response.data.lastName}`,
    );

    const joinedNames = teacherNames.join(', ');

    return {
      key: _id,
      name,
      teachers: joinedNames,
      info,
      admin_name,
      admin_content,
      calendar_link: <Link href={calendar_link}>Calendar Link</Link>,
      school_start_time: formatTime(school_start_time),
      school_end_time: formatTime(school_end_time),
      first_grade_lunch_start_time: formatTime(first_grade_lunch_start_time),
      first_grade_lunch_end_time: formatTime(first_grade_lunch_end_time),
      second_grade_lunch_start_time: formatTime(second_grade_lunch_start_time),
      second_grade_lunch_end_time: formatTime(second_grade_lunch_end_time),
    };
  }

  const [schoolList, setSchoolList] = useState<ISchool[]>([]);
  const schools = useData('school/all');
  const self = useAppSelector(selectUser);

  const [schoolRows, setSchoolRows] = useState<SchoolDashboardRow[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const rows = await Promise.all(
        schoolList.map(async (school: ISchool) =>
          createAdminDashboardRow(school),
        ),
      );
      setSchoolRows(rows);
    };

    fetchData();
  });

  useEffect(() => {
    setSchoolList(schools?.data);
  }, [schools]);

  const [searchInput, setSearchInput] = React.useState('');

  const handleSearch = (e: {
    preventDefault: () => void;
    target: { value: React.SetStateAction<string> };
  }) => {
    e.preventDefault();
    setSearchInput(e.target.value);
  };

  useEffect(() => {
    let filteredSchools = schools?.data || [];

    if (searchInput) {
      const searchQuery = searchInput.toLowerCase();
      filteredSchools = filteredSchools.filter((school: ISchool) => {
        const name = `${school.name}`.toLowerCase();
        return name.includes(searchQuery);
      });
    }
    setSchoolList(filteredSchools);
  }, [searchInput, schools]);

  // if the userlist is not yet populated, display a loading spinner
  if (!schoolList) {
    return (
      <div style={{ width: '0', margin: 'auto' }}>
        <CircularProgress size={80} />
      </div>
    );
  }

  // eslint-disable-next-line
  const [schoolDialogOpen, setSchoolDialogOpen] = useState<boolean>(false);
  // const [schoolList, setSchoolList] = useState<ISchool[]>([]);
  // eslint-disable-next-line
  const [tableData, setTableData] = useState<ISchool[]>([]);
  // eslint-disable-next-line
  const [deleteSchoolDialogOpen, setDeleteSchoolDialogOpen] = useState<boolean>(false);
  // eslint-disable-next-line
  const [editSchoolDialogOpen, setEditSchoolDialogOpen] = useState<boolean>(false);

  // const schools = useData('school/all');

  // eslint-disable-next-line
  useEffect(() => {
    const newData = schools?.data || [];
    setTableData(newData);
  }, [schools]);

  const addSchool = async (
    name: string,
    info: string,
    admin_name: string,
    teachers: string[],
    admin_content: string,
    calendar_link: string,
    school_start_time: Date | null,
    school_end_time: Date | null,
    first_grade_lunch_start_time: Date | null,
    first_grade_lunch_end_time: Date | null,
    second_grade_lunch_start_time: Date | null,
    second_grade_lunch_end_time: Date | null,
  ) => {
    try {
      const newSchool = {
        name,
        info,
        admin_name,
        teachers,
        admin_content,
        calendar_link,
        school_start_time,
        school_end_time,
        first_grade_lunch_start_time,
        first_grade_lunch_end_time,
        second_grade_lunch_start_time,
        second_grade_lunch_end_time,
      };
      const promise = await postData('school/create', newSchool);
      const newRow = await createAdminDashboardRow(promise.data);

      setSchoolList((prevSchoolList) => [...prevSchoolList, promise.data]);
      setSchoolRows((prevSchoolRows) => [...prevSchoolRows, newRow]);
      setTableData((prevTableData) => [...prevTableData, promise.data]);
    } catch (error) {
      console.error('Error adding school:', error);
    }
  };

  const fetchUpdatedSchoolData = async () => {
    try {
      const response = await axios.get(`${URLPREFIX}/school/all`);
      const updatedSchools = response.data;

      if (updatedSchools) {
        const updatedSchoolRows = await Promise.all(
          updatedSchools.map((school: ISchool) =>
            createAdminDashboardRow(school),
          ),
        );

        setSchoolList(updatedSchools);
        setSchoolRows(updatedSchoolRows);
        setTableData(updatedSchools);
      }
    } catch (error) {
      console.error('Error fetching updated school data:', error);
    }
  };

  const editSchool = async (
    id: string,
    name: string,
    info: string,
    teachers: string[],
    admin_name: string,
    admin_content: string,
    calendar_link: string,
    school_start_time: Date | null,
    school_end_time: Date | null,
    first_grade_lunch_start_time: Date | null,
    first_grade_lunch_end_time: Date | null,
    second_grade_lunch_start_time: Date | null,
    second_grade_lunch_end_time: Date | null,
  ) => {
    try {
      const newSchool = {
        id,
        name,
        info,
        admin_name,
        teachers,
        admin_content,
        calendar_link,
        school_start_time,
        school_end_time,
        first_grade_lunch_start_time,
        first_grade_lunch_end_time,
        second_grade_lunch_start_time,
        second_grade_lunch_end_time,
      };
      await putData(`school/update`, newSchool);
      fetchUpdatedSchoolData();
    } catch (error) {
      console.error('Error editing school:', error);
    }
  };

  const deleteSchool = async (schoolId: string) => {
    try {
      await putData(`school/delete`, { id: schoolId });

      // Update state without refreshing the page

      setSchoolList((prevSchoolList) =>
        // eslint-disable-next-line
        prevSchoolList.filter((school) => school._id !== schoolId),
      );

      setSchoolRows((prevSchoolRows) =>
        prevSchoolRows.filter((row) => row.key !== schoolId),
      );

      setTableData((prevTableData) =>
        // eslint-disable-next-line
        prevTableData.filter((item) => item._id !== schoolId),
      );
    } catch (error) {
      console.log('error deleting');
    }
  };

  return (
    <>
      <Header />
      <AddSchoolDialog
        open={schoolDialogOpen}
        setOpen={() => setSchoolDialogOpen(false)}
        addSchool={addSchool}
      />
      <DeleteSchoolDialog
        open={deleteSchoolDialogOpen}
        setOpen={() => setDeleteSchoolDialogOpen(false)}
        options={tableData}
        deleteSchool={deleteSchool}
      />
      <EditSchoolDialog
        open={editSchoolDialogOpen}
        setOpen={() => setEditSchoolDialogOpen(false)}
        editSchool={editSchool}
        schools={tableData}
      />
      <ScreenGrid>
        <Grid item>
          <Typography variant="h2">School Profiles</Typography>
        </Grid>
        <Grid
          item
          container
          width="60vw"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <TextField
            sx={{ my: 2 }}
            size="small"
            label="Search"
            defaultValue="School Name"
            onChange={handleSearch}
            value={searchInput}
          />
          <Grid justifyContent="flex-end">
            <Button
              sx={{ my: 2 }}
              variant="outlined"
              onClick={() => setDeleteSchoolDialogOpen(true)}
            >
              Delete School
            </Button>
            <Button
              sx={{ m: 2 }}
              variant="outlined"
              onClick={() => setSchoolDialogOpen(true)}
            >
              Add School
            </Button>
            <Button
              sx={{ m: 2 }}
              variant="outlined"
              onClick={() => setEditSchoolDialogOpen(true)}
            >
              Edit School
            </Button>
          </Grid>
        </Grid>
        <Grid item>
          <div style={{ height: '60vh', width: '60vw' }}>
            <PaginationTable rows={schoolRows} columns={columns} />
          </div>
        </Grid>
      </ScreenGrid>
    </>
  );
}

export default SchoolProfilePage;
