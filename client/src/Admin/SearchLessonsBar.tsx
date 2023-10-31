import React from 'react';
import { TextField } from '@mui/material';

interface SearchLessonsBarProps {
  allLessons: any[];
}

function SearchLessonsBar({ allLessons }: SearchLessonsBarProps) {
  // Search bar
  const idAgeMapping = new Map<string, string>();
  for (let i = 0; i < allLessons.length; i += 1) {
    const lesson = allLessons[i];
    const number = `Lesson ${lesson.lessonNumber}`;
    // eslint-disable-next-line no-underscore-dangle
    idAgeMapping.set(lesson._id, number);
  }

  const [searchInput, setSearchInput] = React.useState('');

  const handleChange = (e: {
    preventDefault: () => void;
    target: { value: React.SetStateAction<string> };
  }) => {
    e.preventDefault();
    setSearchInput(e.target.value);
  };

  if (searchInput.length > 0) {
    allLessons.filter((lesson: { _id: string }) => {
      // eslint-disable-next-line no-underscore-dangle
      const sUserId = lesson._id;
      const name = idAgeMapping.get(sUserId);
      if (!name) {
        return false;
      }
      return name.match(searchInput);
    });
  }

  return (
    <TextField
      label="Search"
      defaultValue="Student Name"
      onChange={handleChange}
      value={searchInput}
    />
  );
}

export default SearchLessonsBar;
