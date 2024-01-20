/**
 * A file that contains all the components and logic for the table of users
 * in the AdminDashboardPage.
 */
/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import ISchool from '../util/types/school';
import { selectUser } from '../util/redux/userSlice';
import { useAppSelector } from '../util/redux/hooks';
import { useData, URLPREFIX } from '../util/api';
import { PaginationTable, TColumn } from '../components/PaginationTable';

interface SchoolDashboardRow {
  key: string;
  name: string;
  teachers: string;
  info: string;
  admin_name: string;
  admin_content: string;
  calendar_link: string;
  school_start_time: string;
  school_end_time: string;
  first_grade_lunch_start_time: string;
  first_grade_lunch_end_time: string;
  second_grade_lunch_start_time: string;
  second_grade_lunch_end_time: string;
}

/**
 * The standalone table component for holding information about the users in
 * the database and allowing admins to remove users and promote users to admins.
 */
function SchoolProfileTable() {
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
      calendar_link,
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

  // Search bar

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
  return (
    <Box>
      <TextField
        sx={{ mb: 2 }}
        label="Search"
        defaultValue="School Name"
        onChange={handleSearch}
        value={searchInput}
      />
      <PaginationTable rows={schoolRows} columns={columns} />
    </Box>
  );
}

export default SchoolProfileTable;
