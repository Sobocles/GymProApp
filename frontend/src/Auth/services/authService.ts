// src/services/authService.ts

import axios from 'axios';
import apiClient from '../../Apis/apiConfig';
import { LoginCredentials } from '../Interfaces/AuthInterface';


export const loginUser = async ({ email, password }: LoginCredentials) => {
  try {
    console.log(
      "entro");
    const response = await apiClient.post('/login', { email, password });

    return response;
  } catch (error) {
    handleApiError(error);
  }
};

export const register = async (userData: {
  username: string;
  email: string;
  password?: string;
}) => {
  try {
    // Endpoint público que no requiere autenticación
    const response = await apiClient.post('/users/register', userData);
    return response;
  } catch (error) {
    console.error("[UserService] Error en registro:", error);
    throw error;
  }
};

// Función para manejar errores
const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
  
    throw error; 
  }
  // Si no es un AxiosError, aquí lanzas algo genérico
  throw new Error('Ocurrió un error desconocido.');
};

