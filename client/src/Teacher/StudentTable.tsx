/**
 * A file that contains all the components and logic for the table of users
 * in the AdminDashboardPage.
 */
import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { PaginationTable, TColumn } from '../components/PaginationTable';
import { useData } from '../util/api';
import { useAppSelector } from '../util/redux/hooks';
import { selectUser } from '../util/redux/userSlice';
import IUser from '../util/types/user';

interface AdminDashboardRow {
  key: string;
  first: string;
  last: string;
  email: string;
}

/**
 * The standalone table component for holding information about the users in
 * the database and allowing admins to remove users and promote users to admins.
 */
function StudentTable() {
  // define columns for the table
  const columns: TColumn[] = [
    { id: 'first', label: 'First Name' },
    { id: 'last', label: 'Last Name' },
    { id: 'email', label: 'Email' },
  ];

  // Used to create the data type to create a row in the table
  function createAdminDashboardRow(user: IUser): AdminDashboardRow {
    const { _id, firstName, lastName, email } = user;
    return {
      key: _id,
      first: firstName,
      last: lastName,
      email,
    };
  }

  const [userList, setUserList] = useState<IUser[]>([]);
  const self = useAppSelector(selectUser);
  const users = useData(`student/students-by-teacher/${self.email}`);

  // Upon getting the list of users for the database, set the state of the userList to contain all users except for logged in user
  useEffect(() => {
    setUserList(
      users?.data.filter(
        (entry: IUser) => entry && entry.email && entry.email !== self.email,
      ),
    );
  }, [users, self]);

  // if the userlist is not yet populated, display a loading spinner
  if (!userList) {
    return (
      <div style={{ width: '0', margin: 'auto' }}>
        <CircularProgress size={80} />
      </div>
    );
  }
  return (
    <PaginationTable
      rows={userList.map((user: IUser) => createAdminDashboardRow(user))}
      columns={columns}
    />
  );
}

export default StudentTable;
