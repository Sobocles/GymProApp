/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/Auth/hooks/useAuth.ts

import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { loginUser } from '../services/authService';
import { useDispatch, useSelector } from 'react-redux';
import { onLogin, onLogout, updateProfile } from '../store/auth/authSlice';

import { RootState } from '../../store';
import { AxiosError } from 'axios';
import { UserInterface } from '../../Auth/Interfaces/UserInterface';
import apiClient from '../../Apis/apiConfig';
import { LoginCredentials } from '../Interfaces/AuthInterface';
export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAdmin, trainer, isAuth, roles, token } = useSelector(
    (state: RootState) => state.auth
  );
  const navigate = useNavigate();

  // Handler para el login
  const handlerLogin = async (
    { email, password }: LoginCredentials,
    from?: string 
  ) => {
    try {
      const response = await loginUser({ email, password });


      const token = response?.data?.token;
    if (!token) {
      throw new Error("No se recibió token en la respuesta.");
    }

      console.log("aqui el token",token);
      const claims = JSON.parse(window.atob(token.split(".")[1]));
      console.log("aqui los claims",claims);


      // Extraer roles
      let rolesArray: string[] = [];

if (claims.authorities) {
  let authorities = claims.authorities;
  // Si es un string JSON, parsear.
  if (typeof authorities === 'string') {
    try {
      authorities = JSON.parse(authorities);
    } catch (e) {
      authorities = [];
    }
  }
  // Filtrar a strings
  if (Array.isArray(authorities)) {
    rolesArray = authorities.map((r: any) => (typeof r === 'string' ? r : ''));
  }
}

const user: UserInterface = {
  id: claims.id || 0,
  username: claims.username || '',
  email: claims.sub || email,
  admin: claims.isAdmin || false,
  trainer: claims.isTrainer || false,
  roles: rolesArray,
  profileImageUrl: claims.profileImageUrl || '',
};
      console.log("aqui el usuario",user);
      if (user.trainer) {
        console.log("AQUI EDELGARD entro al if user.trainer ",user);
        try {
          const trainerResponse = await apiClient.get(`/trainers/findByUserId/${user.id}`);
          console.log("aca deberia cambiarle el id",trainerResponse);
          const trainerData = trainerResponse.data;
          console.log("Trainer encontrado:", trainerData);
      
          user.id = trainerData.id;
      
          // ACTUALIZA EL TRAINER ID EN REDUX
          dispatch(updateProfile({
            ...user,
            id: trainerData.id  
          }));
        } catch (error) {
          console.error("Error obteniendo trainerId:", error);
        }
      }
      



      dispatch(onLogin({
        user,
        roles: rolesArray,
        isAdmin: user.admin,
        trainer: user.trainer,
        token
      }));
  
      // Guardar en sessionStorage
      sessionStorage.setItem('login', JSON.stringify({
        isAuth: true,
        isAdmin: user.admin,
        trainer: user.trainer,
        user,
        roles: rolesArray,
      }));
      sessionStorage.setItem('token', `${token}`);
  

      // Redirigir al usuario según 'from' o su rol
      if (from) {
        navigate(from);
      } else if (user.admin) {
        console.log("Navegando a /admin/dashboard para admin");
        navigate('/admin/dashboard');
      } else if (user.trainer) {
        console.log("Navegando a /trainers para entrenador");
        navigate('/trainers/dashboard');
      } else {
        console.log("Navegando a /dashboard para usuarios regulares");
        navigate('/dashboard');
      }
      

    } catch (error: unknown) {
      console.error("Error en el login:", error);
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        Swal.fire('Error de inicio de sesión', 'Correo o contraseña incorrectos', 'error');
      } else if (axiosError.response?.status === 403) {
        Swal.fire('Acceso denegado', 'No tiene permisos para acceder', 'error');
      } else {
        Swal.fire('Error inesperado', axiosError.message, 'error');
      }
    }
  };

  // Handler para el logout
  const handlerLogout = () => {
    dispatch(onLogout());
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('login');
    sessionStorage.clear();
    navigate('/auth/login');
  };

  return {
    login: {
      user,
      isAdmin,
      trainer,
      isAuth,
      roles,
      token,
    },
    handlerLogin,
    handlerLogout,
  };
}; 

