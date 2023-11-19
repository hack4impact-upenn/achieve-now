import React from 'react';
import { TextField } from '@mui/material';

interface SearchBarProps {
  handleSearch: (searchInput: string) => void;
}

function SearchBar({ handleSearch }: SearchBarProps) {
  const [searchInput, setSearchInput] = React.useState('');

  const handleChange = (e: {
    preventDefault: () => void;
    target: { value: string };
  }) => {
    e.preventDefault();
    handleSearch(e.target.value);
    setSearchInput(e.target.value);
  };

  return (
    <TextField
      id="search-bar"
      label="Search"
      onChange={handleChange}
      value={searchInput}
      sx={{ mb: 2 }}
    />
  );
}

export default SearchBar;
