/* eslint-disable @typescript-eslint/no-explicit-any */
// src/Admin/hooks/useUsers.ts
import { useDispatch, useSelector } from 'react-redux';
import { 
  addUser, removeUser, loadingUsers, onUserSelectedForm, 
  onOpenForm, onCloseForm, loadingError, updatePaginator, 
  setLoading 
} from '../../Admin/store/users/usersSlice';
import { UserInterface } from '../../Auth/Interfaces/UserInterface';
import * as userService from '../../Admin/services/UserService';
import { useState, useCallback } from 'react';
import apiClient from '../../Apis/apiConfig';
import Swal from 'sweetalert2';
import { useAuth } from "../../Auth/hooks/useAuth";

export const useUsers = () => {
  const dispatch = useDispatch();
  const { users, paginator, visibleForm, errors, isLoading } = useSelector((state: any) => state.users);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
  const { login } = useAuth(); 

  // Usar useCallback para evitar recreación de funciones
  const getUsers = useCallback(async (page: number) => {
    dispatch(setLoading(true));
    try {
      const response = await userService.findAllPages(page, searchTerm);
      dispatch(loadingUsers(response.data.content));
      dispatch(updatePaginator({
        number: response.data.number,
        totalPages: response.data.totalPages,
        first: response.data.first,
        last: response.data.last,
      }));
    } catch (error) {
      console.error(error);
      dispatch(loadingError({ errorMessage: 'Error al cargar usuarios' }));
      Swal.fire({
        title: 'Error',
        text: 'Error al cargar usuarios',
        icon: 'error'
      });
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, searchTerm]);

  const handlerOpenForm = useCallback(() => {
    dispatch(onOpenForm());
  }, [dispatch]);

  const handlerCloseForm = useCallback(() => {
    dispatch(onCloseForm());
  }, [dispatch]);

  const handlerUserSelectedForm = useCallback((user: UserInterface) => {
    dispatch(onUserSelectedForm(user));
  }, [dispatch]);

 // src/Admin/hooks/useUsers.ts

const handlerAddUser = useCallback(async (user: UserInterface) => {
  console.log('Token al crear usuario:', sessionStorage.getItem('token'));
  console.log('¿Es admin?', login?.isAdmin);
  dispatch(setLoading(true));
  
  try {
    Swal.fire({
      title: user.trainer ? 'Creando entrenador...' : 'Creando usuario...',
      text: 'Por favor, espere',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // Datos básicos del usuario para registro
    const userData = {
      username: user.username,
      email: user.email,
      password: ""  // La contraseña la generará el servidor
    };
    
    console.log("Registrando usuario básico:", userData);
    
    // Primera parte: Registrar usuario usando endpoint público
    const response = await userService.register(userData);
    const createdUser = response.data;
    console.log("Usuario registrado:", createdUser);
    
    // Si es necesario, actualizar a Admin (requiere una llamada adicional)
    if (user.admin && login?.isAdmin) {
      try {
        const updateResponse = await userService.update({
          id: createdUser.id,
          username: createdUser.username,
          email: createdUser.email,
          admin: true,
          trainer: user.trainer
        });
        
        console.log("Usuario actualizado a admin:", updateResponse.data);
        createdUser.admin = true;
      } catch (adminError) {
        console.error("Error al convertir usuario a admin:", adminError);
        // Continuar con el proceso aunque falle esta parte
      }
    }
    
    // Segunda parte: Si es entrenador, crear detalles de entrenador
    if (user.trainer && user.trainerDetails && createdUser.id) {
      try {
        console.log("Preparando datos de entrenador para el usuario:", createdUser.id);
        
        // Construir FormData para los detalles del entrenador
        const formData = new FormData();
        
        // Asegurarse de que todos los campos tengan valores válidos
        formData.append('specialization', user.trainerDetails.specialization || '');
        formData.append('experienceYears', String(user.trainerDetails.experienceYears || 0));
        formData.append('availability', user.trainerDetails.availability === true ? 'true' : 'false');
        formData.append('monthlyFee', String(user.trainerDetails.monthlyFee || 0));
        formData.append('title', user.trainerDetails.title || '');
        formData.append('studies', user.trainerDetails.studies || '');
        formData.append('certifications', user.trainerDetails.certifications || '');
        formData.append('description', user.trainerDetails.description || '');
        
        // Añadir campos opcionales solo si existen
        if (user.trainerDetails.instagramUrl && user.trainerDetails.instagramUrl.trim() !== '') 
          formData.append('instagramUrl', user.trainerDetails.instagramUrl);
        
        if (user.trainerDetails.whatsappNumber && user.trainerDetails.whatsappNumber.trim() !== '') 
          formData.append('whatsappNumber', user.trainerDetails.whatsappNumber);
        
        // Si hay un archivo, asegurarse de que sea válido
        if (user.certificationFile && user.certificationFile instanceof File) {
          formData.append('certificationFile', user.certificationFile);
        }

        console.log("Enviando solicitud de asignación de entrenador");
        
        // Llamada a la API usando apiClient
        const assignResponse = await apiClient.post(
          `/trainers/${createdUser.id}/assign`,
          formData,
          {
            headers: {
              // No establecer Content-Type, dejamos que axios lo configure automáticamente
              // para FormData con el boundary correcto
            },
            timeout: 60000 // Aumentar el timeout para archivos grandes
          }
        );
        
        console.log("Respuesta de asignación de entrenador:", assignResponse);
        
        // Actualizar el usuario con los detalles de entrenador
        const updatedUser = {
          ...createdUser,
          trainer: true // Asegurarse de que el frontend reconozca que es un entrenador
        };
        
        dispatch(addUser(updatedUser));
        
        // Cerrar la alerta de carga
        Swal.close();

        // Mostrar alerta de éxito
        Swal.fire({
          title: '¡Éxito!',
          text: 'El entrenador se creó exitosamente.',
          icon: 'success'
        });

        // Cerrar el formulario
        dispatch(onCloseForm());
        
      } catch (trainerError: any) {
        console.error("Error al asignar rol de entrenador:", trainerError);
        
        // Mostrar detalles del error para depuración
        if (trainerError.response) {
          console.error("Detalles del error:", {
            status: trainerError.response.status,
            statusText: trainerError.response.statusText,
            data: trainerError.response.data,
            headers: trainerError.response.headers
          });
        }
        
        // Si falla la asignación de entrenador, eliminamos el usuario creado
        try {
          console.log("Eliminando usuario debido a error en asignación:", createdUser.id);
          await userService.remove(createdUser.id);
          console.log("Usuario eliminado con éxito");
        } catch (deleteError) {
          console.error("Error al eliminar usuario tras fallo en asignación:", deleteError);
        }

        // Cerrar el loading en caso de error
        Swal.close();
        
        // Determinar el mensaje de error más específico posible
        let errorMessage = "Error al asignar rol de entrenador.";
        
        if (trainerError.response?.status === 403) {
          errorMessage = "No tiene permisos para realizar esta operación. Verifique sus credenciales.";
        } else if (trainerError.response?.data?.message) {
          errorMessage = trainerError.response.data.message;
        } else if (trainerError.message) {
          errorMessage = trainerError.message;
        }
        
        // Mostrar el mensaje de error
        Swal.fire({
          title: 'Error',
          text: errorMessage,
          icon: 'error'
        });
        
        dispatch(loadingError({ errorMessage }));
      }
    } else {
      // Si no es entrenador, simplemente añadir el usuario al estado
      dispatch(addUser(createdUser));
      
      // Cerrar la alerta de carga
      Swal.close();

      // Mostrar alerta de éxito según el tipo de usuario creado
      Swal.fire({
        title: '¡Éxito!',
        text: user.admin ? 'El administrador se creó exitosamente.' : 'El usuario se creó exitosamente.',
        icon: 'success'
      });

      // Cerrar el formulario
      dispatch(onCloseForm());
    }
    
  } catch (error: any) {
    console.error("Error al crear usuario:", error);
    
    // Cerrar el loading en caso de error
    Swal.close();
    
    const mensajeError = error.response && error.response.data 
                          ? error.response.data.message || 'Error al crear usuario' 
                          : error.message || 'Error al crear usuario';
    
    dispatch(loadingError({ errorMessage: mensajeError }));
    
    Swal.fire({
      title: 'Error',
      text: mensajeError,
      icon: 'error'
    });
  } finally {
    dispatch(setLoading(false));
  }
}, [dispatch, login, onCloseForm]);

  const handlerRemoveUser = useCallback(async (id: number) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede revertir",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    setDeletingUserId(id);
    dispatch(setLoading(true)); // Añadido este estado de carga global

    try {
      await userService.remove(id);
      dispatch(removeUser(id));
      Swal.fire({
        title: 'Eliminado',
        text: 'El usuario se eliminó correctamente',
        icon: 'success'
      });
    } catch (error) {
      console.error(error);
      dispatch(loadingError({ errorMessage: 'Error al eliminar usuario' }));
      Swal.fire({
        title: 'Error',
        text: 'Error al eliminar usuario',
        icon: 'error'
      });
    } finally {
      setDeletingUserId(null);
      dispatch(setLoading(false)); // Asegurarse de restablecer el estado de carga
    }
  }, [dispatch]);

  return {
    users,
    visibleForm,
    handlerOpenForm,
    handlerCloseForm,
    handlerUserSelectedForm,
    handlerAddUser,
    handlerRemoveUser,
    paginator,
    searchTerm,
    setSearchTerm,
    getUsers,
    errors,
    isLoading,
    deletingUserId,
  };
};