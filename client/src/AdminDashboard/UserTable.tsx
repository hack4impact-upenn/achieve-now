/**
 * A file that contains all the components and logic for the table of users
 * in the AdminDashboardPage.
 */
import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { PaginationTable, TColumn } from '../components/PaginationTable';
import DeleteUserButton from './DeleteUserButton';
// import PromoteUserButton from './PromoteUserButton';
import { useData } from '../util/api';
import { useAppSelector } from '../util/redux/hooks';
import { selectUser } from '../util/redux/userSlice';
import IUser from '../util/types/user';

interface AdminDashboardRow {
  key: string;
  first: string;
  last: string;
  email: string;
  userRole: string;
  remove: React.ReactElement;
}

/**
 * The standalone table component for holding information about the users in
 * the database and allowing admins to remove users and promote users to admins.
 */
function UserTable() {
  // define columns for the table
  const columns: TColumn[] = [
    { id: 'first', label: 'First Name' },
    { id: 'last', label: 'Last Name' },
    { id: 'email', label: 'Email' },
    { id: 'userRole', label: 'Role' },
    { id: 'remove', label: 'Remove User' },
  ];

  // Used to create the data type to create a row in the table
  function createAdminDashboardRow(
    user: IUser,
    remove: React.ReactElement,
  ): AdminDashboardRow {
    const { _id, firstName, lastName, email, role } = user;
    let userRole = role;
    if (userRole === 'parent') {
      userRole = 'family';
    }
    userRole = userRole.charAt(0).toUpperCase() + userRole.slice(1);
    return {
      key: _id,
      first: firstName,
      last: lastName,
      email,
      userRole,
      remove,
    };
  }

  const [userList, setUserList] = useState<IUser[]>([]);
  const users = useData('admin/all');
  const self = useAppSelector(selectUser);

  // Upon getting the list of users for the database, set the state of the userList to contain all users except for logged in user
  useEffect(() => {
    setUserList(
      users?.data.filter(
        (entry: IUser) => entry && entry.email && entry.email !== self.email,
      ),
    );
  }, [users, self]);

  // update state of userlist to remove a user from  the frontend representation of the data
  const removeUser = (user: IUser) => {
    setUserList(
      userList.filter(
        (entry: IUser) => entry && entry.email && entry.email !== user.email,
      ),
    );
  };
  // update state of userlist to change user role on the frontend representation
  const updateRole = (email: string, newRole: string) => {
    setUserList(
      userList.map((entry) => {
        if (entry.email !== email) {
          return entry;
        }
        const newEntry = entry;
        newEntry.role = newRole;
        return newEntry;
      }),
    );
  };

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
      rows={userList.map((user: IUser) =>
        createAdminDashboardRow(
          user,
          <DeleteUserButton
            role={user.role}
            email={user.email}
            removeRow={() => removeUser(user)}
          />,
        ),
      )}
      columns={columns}
    />
  );
}

export default UserTable;
