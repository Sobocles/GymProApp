// src/Admin/services/UserService.ts
import apiClient from "../../Apis/apiConfig";
import { UserInterface } from '../../Auth/Interfaces/UserInterface';

const BASE_URL = '/users';

/**
 * Recupera todos los usuarios
 */
export const findAll = async() => {
  try {
    const response = await apiClient.get(BASE_URL);
    return response;
  } catch (error) {
    console.error("[UserService] Error en findAll:", error);
    throw error;
  }
};

/**
 * Recupera usuarios paginados con opción de búsqueda
 */
export const findAllPages = async (page = 0, search = '') => {
  try {
    const response = await apiClient.get(`${BASE_URL}/page/${page}`, {
      params: {
        search,
      },
    });
    return response;
  } catch (error) {
    console.error("[UserService] Error en findAllPages:", error);
    throw error;
  }
};

/**
 * Guarda un nuevo usuario
 * Separa trainerDetails para evitar enviar datos incorrectos al backend
 */
export const save = async (user: UserInterface) => {
  try {
    // Extraer SOLO los campos básicos de usuario y descartar el resto
    const basicUserData = {
      id: user.id || "",
      username: user.username,
      email: user.email,
      password: user.password || "",
      admin: user.admin,
      trainer: user.trainer
    };
   
    console.log("[UserService] Datos de usuario filtrados a enviar:", basicUserData);
    console.log("[UserService] Token usado:", sessionStorage.getItem('token'));
   
    const response = await apiClient.post(BASE_URL, basicUserData);
    console.log("[UserService] Respuesta de creación:", response);
   
    return response;
  } catch (error) {
    console.error("[UserService] Error en save:", error);
    throw error;
  }
};

/**
 * Actualiza un usuario existente
 */
export const update = async ({ id, username, email, admin, trainer }: UserInterface) => {
  try {
    const response = await apiClient.put(`${BASE_URL}/${id}`, { username, email, admin, trainer });
    return response;
  } catch (error) {
    console.error("[UserService] Error en update:", error);
    throw error;
  }
};

/**
 * Elimina un usuario por su ID
 */
export const remove = async (id: number | string) => {
  try {
    const response = await apiClient.delete(`${BASE_URL}/${id}`);
    return response;
  } catch (error) {
    console.error("[UserService] Error en remove:", error);
    throw error;
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