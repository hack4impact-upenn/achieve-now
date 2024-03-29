/* eslint-disable no-underscore-dangle */
/**
 * A file that contains all the components and logic for the table of users
 * in the AdminDashboardPage.
 */
import React, { useEffect, useMemo, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import IUser from '../util/types/user';
import { selectUser } from '../util/redux/userSlice';
import { useAppSelector } from '../util/redux/hooks';
import { useData, URLPREFIX } from '../util/api';
import { PaginationTable, TColumn } from '../components/PaginationTable';
import DeleteUserButton from '../AdminDashboard/DeleteUserButton';
import InviteUserButton from '../components/buttons/InviteUserButton';

const baseUrl = process.env.PUBLIC_URL
  ? process.env.PUBLIC_URL
  : 'http://localhost:3000';

interface AdminDashboardRow {
  key: string;
  first: string;
  last: string;
  email: string;
  role: string;
  link: string;
  remove: React.ReactElement;
}
interface AddOnUser {
  user: IUser;
  studentId?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
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
    { id: 'role', label: 'Role' },
    { id: 'link', label: 'Profile Link' },
    { id: 'remove', label: 'Remove User' },
  ];

  function capitalizeFirstLetter(str: any) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Used to create the data type to create a row in the table
  function createAdminDashboardRow(
    userInput: AddOnUser,
    remove: React.ReactElement,
  ): AdminDashboardRow {
    const { user, studentId } = userInput;
    if (user) {
      if (user.role === 'parent' && studentId) {
        return {
          // eslint-disable-next-line no-underscore-dangle
          key: user._id,
          first: user.firstName,
          last: user.lastName,
          email: user.email,
          role: capitalizeFirstLetter(user.role),
          link: `${baseUrl}/admin/student/profile/${studentId}`,
          remove,
        };
      }
      if (user.role === 'coach' && studentId) {
        return {
          key: user._id,
          first: user.firstName,
          last: user.lastName,
          email: user.email,
          role: capitalizeFirstLetter(user.role),
          link: `${baseUrl}/admin/coach/profile/${studentId}`,
          remove,
        };
      }
      return {
        key: user._id,
        first: user.firstName,
        last: user.lastName,
        email: user.email,
        role: capitalizeFirstLetter(user.role),
        link: ``,
        remove,
      };
    }
    return {
      key: '',
      first: '',
      last: '',
      email: '',
      role: '',
      link: '',
      // eslint-disable-next-line react/jsx-no-useless-fragment
      remove: (<></>) as React.ReactElement,
    };
  }

  const [userList, setUserList] = useState<AddOnUser[]>([]);
  const users = useData('admin/all');

  const sortedUsers = useMemo(
    () =>
      userList.sort((a, b) => (a.user.firstName > b.user.firstName ? 1 : -1)),
    [userList],
  );
  const self = useAppSelector(selectUser);

  const [role, setRole] = React.useState('all');

  const handleChange = (event: SelectChangeEvent) => {
    setUserList(users?.data.filter((entry: AddOnUser) => entry.role === role));
    setRole(event.target.value as string);
  };
  async function convertStudentData(filteredList: IUser[]) {
    // eslint-disable-next-line prefer-const
    let resList = filteredList.map((userEntry: IUser) => ({
      user: userEntry,
      studentId: '',
    }));
    for (let i = 0; i < resList.length; i += 1) {
      const user = resList[i];
      if (user.user.role === 'parent') {
        try {
          // eslint-disable-next-line no-await-in-loop
          await axios
            .get(`${URLPREFIX}/student/student-info/${user.user._id}`)
            .then((res) => {
              user.studentId = res.data._id;
            });
        } catch {
          user.studentId = '';
        }
        resList[i] = user;
      } else if (user.user.role === 'coach') {
        // eslint-disable-next-line no-await-in-loop
        try {
          // eslint-disable-next-line no-await-in-loop
          const res1 = await axios.get(
            `${URLPREFIX}/coach/user/${user.user._id}`,
          );
          user.studentId = res1?.data._id;
        } catch {
          resList[i].studentId = '';
        }
      } else {
        user.studentId = '';
      }
      resList[i] = user;
    }
    setUserList(resList);
  }
  // Upon getting the list of users for the database, set the state of the userList to contain all users except for logged in user
  useEffect(() => {
    let filteredList = users?.data.filter(
      (entry: IUser) => entry && entry.email && entry.email !== self.email,
    );
    if (role !== 'all' && role !== '') {
      filteredList = users?.data.filter(
        (entry: IUser) =>
          entry &&
          entry.email &&
          entry.email !== self.email &&
          entry.role === self.role,
      );
    }
    convertStudentData(filteredList || []);
  }, [users, role, self]);

  // Search bar
  const userData = users?.data ?? [];

  const [searchInput, setSearchInput] = React.useState('');

  const handleSearch = (e: {
    preventDefault: () => void;
    target: { value: React.SetStateAction<string> };
  }) => {
    e.preventDefault();
    setSearchInput(e.target.value);
  };

  // update state of userlist to remove a user from  the frontend representation of the data
  const removeUser = (user: IUser) => {
    setUserList(
      userList.filter(
        (entry: AddOnUser) =>
          entry &&
          entry.user &&
          entry.user.email &&
          entry.user.email !== user.email,
      ),
    );
  };

  useEffect(() => {
    let filteredUsers = users?.data || [];

    if (searchInput) {
      const searchQuery = searchInput.toLowerCase();
      filteredUsers = filteredUsers.filter((user: AddOnUser) => {
        const name = `${user.firstName} ${user.lastName}`.toLowerCase();
        return name.includes(searchQuery);
      });
    }

    if (role === 'all') {
      const i = 1;
    } else if (role) {
      filteredUsers = filteredUsers.filter(
        (user: AddOnUser) => user.role === role,
      );
    }
    convertStudentData(filteredUsers);
  }, [searchInput, role, users, self]);

  // if the userlist is not yet populated, display a loading spinner
  if (!userList) {
    return (
      <div style={{ width: '0', margin: 'auto' }}>
        <CircularProgress size={80} />
      </div>
    );
  }
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <div style={{ marginBottom: '10px' }}>
          <TextField
            sx={{ m: 1 }}
            label="Search"
            defaultValue="Name"
            size="small"
            onChange={handleSearch}
            value={searchInput}
          />
          <FormControl>
            <InputLabel>Attribute</InputLabel>
            <Select
              value={role}
              sx={{ m: 1, minWidth: 120 }}
              label="Role"
              onChange={handleChange}
              defaultValue="all"
              size="small"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="parent">Family</MenuItem>
              <MenuItem value="coach">Coach</MenuItem>
              <MenuItem value="teacher">Teacher</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </div>
        <InviteUserButton />
      </Box>
      <Box sx={{ pb: 30 }}>
        <PaginationTable
          rows={sortedUsers.map((user: AddOnUser) => {
            return createAdminDashboardRow(
              user,
              <DeleteUserButton
                role={user.user.role}
                email={user.user.email}
                removeRow={() => removeUser(user.user)}
              />,
            );
          })}
          columns={columns}
        />
      </Box>
    </Box>
  );
}

export default UserTable;
