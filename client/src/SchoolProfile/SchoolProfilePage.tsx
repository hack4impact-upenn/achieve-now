/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import { Typography, Grid } from '@mui/material';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ScreenGrid from '../components/ScreenGrid';
import SchoolProfileTable from './SchoolProfileTable';
import AddSchoolDialog from './AddSchoolDialog';
import DeleteSchoolDialog from './DeleteSchoolDialog';
import EditSchoolDialog from './EditSchoolDialog';
import { useData, postData, putData } from '../util/api';
import ISchool from '../util/types/school';

function SchoolProfilePage() {
  const navigate = useNavigate();
  function handleClick() {
    const s = `/users`;
    navigate(s);
  }

  const [schoolDialogOpen, setSchoolDialogOpen] = useState<boolean>(false);
  // const [schoolList, setSchoolList] = useState<ISchool[]>([]);
  const [tableData, setTableData] = useState<ISchool[]>([]);
  const [deleteSchoolDialogOpen, setDeleteSchoolDialogOpen] =
    useState<boolean>(false);
  const [editSchoolDialogOpen, setEditSchoolDialogOpen] =
    useState<boolean>(false);

  const schools = useData('school/all');

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
      setTableData([...tableData, promise.data]);
    } catch (error) {
      console.error('Error deleting date:', error);
    }
  };

  const editSchool = async (
    id: string,
    name: string,
    info: string,
    teachers: string,
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
      // update putData
      const promise = await putData(`school/update`, newSchool);
      console.log('editted');
      // eslint-disable-next-line
      const removed = tableData.filter((r: ISchool) => r._id !== id);
      setTableData([promise.data, ...removed]);
    } catch (error) {
      console.error('Error deleting school:', error);
    }
  };

  const deleteSchool = async (schoolId: string) => {
    try {
      await putData(`school/delete`, { id: schoolId });

      // Update state without refreshing the page
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
        <Grid item container width="60vw" justifyContent="flex-end">
          <Button
            sx={{ m: 2 }}
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
