import {
  SelectChangeEvent,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  Checkbox,
  ListItemText,
} from '@mui/material';
import React from 'react';

interface MultipleSelectCheckmarksProps {
  values: string[];
  setValues: React.Dispatch<React.SetStateAction<string[]>>;
  label: string;
  allValues: string[];
}

export default function MultipleSelectCheckmarks({
  values,
  setValues,
  label,
  allValues,
}: MultipleSelectCheckmarksProps) {
  const handleChange = (event: SelectChangeEvent<typeof values>) => {
    const {
      target: { value },
    } = event;
    setValues(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <div>
      <FormControl fullWidth>
        <InputLabel>{label}</InputLabel>
        <Select
          multiple
          value={values}
          onChange={handleChange}
          input={<OutlinedInput label={label} />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
        >
          {allValues.map((val) => (
            <MenuItem key={val} value={val}>
              <Checkbox checked={values.indexOf(val) > -1} />
              <ListItemText primary={val} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
