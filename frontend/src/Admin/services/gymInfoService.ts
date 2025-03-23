// src/api/gymInfoService.ts
import apiClient from '../../Apis/apiConfig';
import { GymInfoValues } from '../../Admin/pages/GymInfoForm';

export const createGymInfo = async (data: GymInfoValues) => {
    try {
      const response = await apiClient.post('/api/gym-info', data);
      return response.data;
    } catch (error) {
      console.error('Error al crear la información del gym:', error);
      throw error;
    }
  };
  
  // Nuevos métodos para obtener y actualizar
  export const getGymInfo = async (): Promise<GymInfoValues> => {
    try {
      const response = await apiClient.get('/api/gym-info');
      return response.data;
    } catch (error) {
      console.error('Error al obtener la información del gym:', error);
      throw error;
    }
  };
  
  export const updateGymInfo = async (id: number, data: GymInfoValues) => {
    try {
      const response = await apiClient.put(`/api/gym-info/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar la información del gym:', error);
      throw error;
    }
  };
