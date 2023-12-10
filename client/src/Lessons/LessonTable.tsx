/**
 * A file that contains all the components and logic for the table of users
 * in the AdminDashboardPage.
 */
import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { PaginationTable, TColumn } from '../components/PaginationTable';
import { useData } from '../util/api';
import ILesson from '../util/types/lesson';

interface LessonDashboardRow {
  key: string;
  number: number;
  title: string;
}

/**
 * The standalone table component for holding information about the users in
 * the database and allowing admins to remove users and promote users to admins.
 */
function LessonTable() {
  // define columns for the table
  const columns: TColumn[] = [
    { id: 'number', label: 'Lesson Number' },
    { id: 'title', label: 'Lesson Name' },
  ];

  // Used to create the data type to create a row in the table
  function createLessonDashboardRow(lesson: ILesson): LessonDashboardRow {
    const { _id, number, title } = lesson;
    const key = _id;
    return {
      key,
      number,
      title,
    };
  }

  const [lessonList, setLessonList] = useState<ILesson[]>([]);
  const lessons = useData(`lesson/all`);

  // Upon getting the list of users for the database, set the state of the userList to contain all users except for logged in user
  useEffect(() => {
    setLessonList(
      lessons?.data.filter((entry: ILesson) => entry && entry.number),
    );
  }, [lessons]);

  // if the userlist is not yet populated, display a loading spinner
  if (!lessonList) {
    return (
      <div style={{ width: '0', margin: 'auto' }}>
        <CircularProgress size={80} />
      </div>
    );
  }
  return (
    <PaginationTable
      rows={lessonList.map((lesson: ILesson) =>
        createLessonDashboardRow(lesson),
      )}
      columns={columns}
    />
  );
}

export default LessonTable;
