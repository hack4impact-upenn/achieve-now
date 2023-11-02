import React, { useEffect, useState } from 'react';import { Typography, Grid } from '@mui/material';
import ScreenGrid from '../components/ScreenGrid';
import SchoolProfileTable from './SchoolProfileTable';
import Button from '@mui/material/Button';
import AddSchoolDialog from './AddSchoolDialog';
import DeleteSchoolDialog from './DeleteSchoolDialog';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import { useData } from '../util/api';
import ISchool from '../util/types/school'; 

function SchoolProfilePage() {
  const navigate = useNavigate();
  function handleClick() {
    const s = `/users`;
    navigate(s);
  }

  const [schoolDialogOpen, setSchoolDialogOpen] = useState<boolean>(false);
  const [schoolList, setSchoolList] = useState<ISchool[]>([]);
  const [deleteSchoolDialogOpen, setDeleteSchoolDialogOpen] =
    useState<boolean>(false);

  const schools = useData('school/all');
  
  const addSchool = async (name: string,
    info: string,
    admin_name: string,
    teachers: string,
    admin_content: string,
    calendar_link: string,
    school_start_time: Date | null,
    school_end_time: Date | null,
    first_grade_lunch_start_time: Date | null,
    first_grade_lunch_end_time: Date | null,
    second_grade_lunch_start_time: Date | null,
    second_grade_lunch_end_time: Date | null) => {
    await axios.post('http://localhost:4000/api/school/create', {
      name,
      info,
      admin_name,
      "teachers" : [],
      admin_content,
      calendar_link,
      school_start_time,
      school_end_time,
      first_grade_lunch_start_time,
      first_grade_lunch_end_time,
      second_grade_lunch_start_time,
      second_grade_lunch_end_time
    });
  };

  return (
    <>
      <AddSchoolDialog
        open={schoolDialogOpen}
        setOpen={() => setSchoolDialogOpen(false)}
        addSchool={addSchool}
      />
    <ScreenGrid>
      <Grid item>
        <Typography variant="h2">School Profiles</Typography>
      </Grid>
      <Grid item container width="60vw" justifyContent="flex-end">
        <Button variant="outlined" onClick={handleClick}>
          Delete School
        </Button>
        <Button variant="outlined" onClick={() => setSchoolDialogOpen(true)}>
          Add School
        </Button>
      </Grid>
      <Grid item>
        <div style={{ height: '60vh', width: '60vw' }}>
          <SchoolProfileTable />
        </div>
      </Grid>
    </ScreenGrid>
    </>
    
  );
}

export default SchoolProfilePage;
