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
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';

interface AdminDashboardRow {
    key: string;
  first: string;
  last: string;
  email: string;
  role: string;
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
  ];

  // Used to create the data type to create a row in the table
  function createAdminDashboardRow(
    user: IUser,
  ): AdminDashboardRow {
    const { _id, firstName, lastName, email, role } = user;
    return {
        key: _id,
      first: firstName,
      last: lastName,
      email,
      role,
    };
  }

  const [userList, setUserList] = useState<IUser[]>([]);
  const users = useData('admin/all');
  const self = useAppSelector(selectUser);

  const [role, setRole] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setUserList(
        users?.data.filter(
          (entry: IUser) => entry.role === role,
        ),
    );
    setRole(event.target.value as string);
  };

  // Upon getting the list of users for the database, set the state of the userList to contain all users except for logged in user
  useEffect(() => {
    if (role === '') {
        setUserList(
            users?.data.filter(
              (entry: IUser) => entry && entry.email && entry.email !== self.email,
            ),
        );
    } else {
        setUserList(
            users?.data.filter(
              (entry: IUser) => entry && entry.email && entry.email !== self.email && entry.role === self.role,
            ),
        );
    }
  }, [users, self]);


    // Search bar
    const userData = users?.data ?? [];
    const idNameMapping = new Map<string, string>();
    for (let i = 0; i < userData.length; i += 1) {
      const user = userData[i];
      const name = `${user.firstName} ${user.lastName}`;
      idNameMapping.set(user._id, name);
    }
  
    const [searchInput, setSearchInput] = React.useState('');
  
    const handleSearch = (e: {
      preventDefault: () => void;
      target: { value: React.SetStateAction<string> };
    }) => {
      e.preventDefault();
      setSearchInput(e.target.value);
    };
    
    useEffect(() => {
        let filteredUsers = users?.data || [];
    
        if (searchInput) {
          const searchQuery = searchInput.toLowerCase();
          filteredUsers = filteredUsers.filter((user : IUser) => {
            const name = `${user.firstName} ${user.lastName}`.toLowerCase();
            return name.includes(searchQuery);
          });
        }
    
        if (role) {
          filteredUsers = filteredUsers.filter((user : IUser) => user.role === role);
        }    
        setUserList(filteredUsers);
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
        <TextField
            label="Search"
            defaultValue="Name"
            onChange={handleSearch}
            value={searchInput}
        />
      <FormControl>
        <InputLabel>Attribute</InputLabel>
        <Select
          value={role}
          label="Role"
          onChange={handleChange}
        >
          <MenuItem value={'student'}>Student</MenuItem>
          <MenuItem value={'coach'}>Coach</MenuItem>
          <MenuItem value={'teacher'}>Teacher</MenuItem>
          <MenuItem value={'admin'}>Admin</MenuItem>
        </Select>
      </FormControl>
    <PaginationTable
      rows={userList.map((user: IUser) =>
        createAdminDashboardRow(
          user,
        ),
      )}
      columns={columns}
    />
    </Box>
  );
}

export default UserTable;
