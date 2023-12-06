import React from 'react';
import Button from '@mui/material/Button';
import AlertType from '../util/types/alert';
import useAlert from '../util/hooks/useAlert';
import { postData } from '../util/api';

function DeleteLessonButton() {
  const { setAlert } = useAlert();

  const handleDeleteLesson = async () => {
    postData('lesson/deleteLesson').then((res) => {
      if (res.error) {
        setAlert(`res.error.message`, AlertType.ERROR);
      } else {
        setAlert(`Last Lesson successfully deleted`, AlertType.SUCCESS);
        window.location.reload();
      }
    });
  };

  return (
    <div style={{ marginBottom: '10px' }}>
      <Button
        style={{ width: '100px' }}
        variant="outlined"
        onClick={handleDeleteLesson}
      >
        Delete
      </Button>
    </div>
  );
}

export default DeleteLessonButton;
