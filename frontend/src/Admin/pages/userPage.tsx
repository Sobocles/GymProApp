import React, { useEffect } from "react";
import { useAuth } from "../../Auth/hooks/useAuth";
import { useUsers } from "../hooks/useUsers";
import { UserModalForm } from "../components/useModalForm";
import { UsersList } from "../components/UsersList"; // Asegúrate de que la importación sea correcta
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { useParams } from "react-router-dom";
import { Paginator } from "../components/Paginator";
import SearchBar from "../../components/common/SearchBar";

export const UsersPage = () => {
  const { page: pageParam } = useParams();
  // Si no existe, fallback a '0'
  const currentPage = parseInt(pageParam ?? '0', 10);
  
  const {
    users,
    visibleForm,
    handlerOpenForm,
    paginator,
    searchTerm,
    setSearchTerm,
    getUsers,
    isLoading
  } = useUsers();
  
  const { login } = useAuth();
  
  useEffect(() => {
    // Llamar a getUsers solo cuando cambia la página o el término de búsqueda
    getUsers(currentPage);  
  }, [currentPage, searchTerm, getUsers]);  
  
  return (
    <>
      {visibleForm && <UserModalForm />}
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Gestión de Usuarios
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          {(!visibleForm && login.isAdmin) && (
            <Button
              variant="contained"
              color="primary"
              onClick={handlerOpenForm}
              // Quitamos la condición de deshabilitado para este botón
            >
              Nuevo Usuario
            </Button>
          )}
          
          {/* Barra de búsqueda */}
          <SearchBar
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </Box>
        
        {isLoading && users.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <UsersList />
            
            {/* Mostrar el paginador solo si no hay término de búsqueda */}
            {searchTerm === '' && paginator.totalPages > 1 && (
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <Paginator
                  url="/admin/users"
                  paginator={{
                    number: paginator.number,
                    totalPages: paginator.totalPages,
                    first: paginator.first,
                    last: paginator.last,
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </>
  );
};