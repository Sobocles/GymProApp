// src/Admin/components/UsersList.tsx
import React from 'react';
import { UserRow } from "./userRow";
import { useUsers } from "../hooks/useUsers";
import { useAuth } from "../../Auth/hooks/useAuth";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Box,
  Typography
} from '@mui/material';

export const UsersList = () => {
  const { users, isLoading, deletingUserId } = useUsers();
  const { login } = useAuth();
  
  // Solo mostrar el spinner de carga completa cuando estamos cargando Y no hay usuarios
  if (isLoading && users.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // Si no hay usuarios (después de comprobar que no estamos cargando)
  if (!isLoading && users.length === 0) {
    return (
      <Typography variant="body1" sx={{ my: 2 }}>
        No hay usuarios en el sistema.
      </Typography>
    );
  }
  
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Imagen</TableCell>
          <TableCell>#</TableCell>
          <TableCell>Username</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Roles</TableCell>
          {login.isAdmin && (
            <>
              <TableCell>Editar</TableCell>
              <TableCell>Eliminar</TableCell>
            </>
          )}
        </TableRow>
      </TableHead>
      <TableBody>
        {users.map((user) => (
          <UserRow
            key={user.id}
            profileImageUrl={user.profileImageUrl}
            id={user.id}
            username={user.username}
            email={user.email}
            admin={user.admin}
            trainer={user.trainer || false}
            roles={user.roles || []}
            isDeleting={deletingUserId === user.id}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default UsersList;