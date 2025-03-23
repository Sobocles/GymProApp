import React from 'react';
import { useUsers } from '../hooks/useUsers';
import { UserForm } from './UseForm';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../../Auth/hooks/useAuth';

export const UserModalForm = () => {
  const { userSelected, visibleForm, handlerCloseForm, handlerAddUser } = useUsers();

  const { login } = useAuth(); // Asegúrate de importar useAuth
  
  console.log('Estado de login al abrir modal:', login); // Añade esto
  console.log('Token al abrir modal:', sessionStorage.getItem('token')); 

  const validUserSelected = userSelected || {
    id: '',
    username: '',
    email: '',
    password: '',
    admin: false,
    trainer: false,
    role: '',
    roles: []
  };

  const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%', // Ajustar el ancho para pantallas más pequeñas
    maxWidth: 600, // Ancho máximo del modal
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    overflowY: 'auto', // Habilitar desplazamiento vertical
    maxHeight: '80vh', // Altura máxima relativa a la ventana
  };

  return (
    <Modal
      open={visibleForm}
      onClose={handlerCloseForm}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography id="modal-title" variant="h6" component="h2">
            {validUserSelected.id ? 'Editar' : 'Crear'} Usuario
          </Typography>
          <IconButton aria-label="close" onClick={handlerCloseForm}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box id="modal-description" sx={{ mt: 2 }}>
          <UserForm
            userSelected={validUserSelected} // Pasar un valor válido
            handlerAddUser={handlerAddUser}
            handlerCloseForm={handlerCloseForm}
          />
        </Box>
      </Box>
    </Modal>
  );
};
