import {
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    MenuItem,
    Select,
    Stack,
  } from '@mui/material';
  import dayjs from 'dayjs';
  import React, { useState } from 'react';
  
  interface DeleteSchoolDialogProps {
    open: boolean;
    setOpen: (newOpen: boolean) => void;
    options: string[];
    deleteSchool: (name: String) => void;
  }
  
  function DeleteSchoolDialog({
    open,
    setOpen,
    options,
    deleteSchool,
  }: DeleteSchoolDialogProps) {
    const [school, setSchool] = useState<string | null>(null);
  
    const handleSubmit = () => {
      if (!name) {
        return;
      }
      deleteSchool(name);
      setOpen(false);
    };
  
    return (
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle sx={{ textAlign: 'center' }}>Delete School</DialogTitle>
        <DialogActions
          sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}
        >
          <Stack
            direction="row"
            spacing={2}
            sx={{ width: '100%', justifyContent: 'space-between' }}
          >
            <Select
              value={name}
              sx={{
                minWidth: 150,
              }}
              onChange={(event) => setSchool(event.target.value as string)}
            >
              {options.map((option) => (
                <MenuItem value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            <Button variant="outlined" onClick={handleSubmit}>
              Submit
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    );
  }
  
  export default DeleteDateDialog;
  