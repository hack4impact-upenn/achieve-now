import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import Modal from '@mui/material/Modal';
import AlertType from '../util/types/alert';
import useAlert from '../util/hooks/useAlert';
import { postData } from '../util/api';

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

function DeleteLessonButton() {
  const [openConfirmationModal, setOpenConfirmationModal] =
    React.useState(false);
  const handleOpenConfirmationModal = () => setOpenConfirmationModal(true);
  const handleCloseConfirmationModal = () => setOpenConfirmationModal(false);

  const { setAlert } = useAlert();

  const handleDeleteLesson = async () => {
    postData('lesson/deleteLesson').then((res) => {
      if (res.error) {
        setAlert(`Failed to Delete Lesson`, AlertType.ERROR);
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
        onClick={handleOpenConfirmationModal}
      >
        Delete
      </Button>
      <Modal
        open={openConfirmationModal}
        onClose={handleCloseConfirmationModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Are you sure you want to delete this lesson?
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            This will delete the lesson with the highest number and its
            associated data.
          </Typography>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '30px',
            }}
          >
            <Button
              variant="contained"
              sx={{ marginRight: '5px' }}
              onClick={handleCloseConfirmationModal}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteLesson}
            >
              Delete
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default DeleteLessonButton;
