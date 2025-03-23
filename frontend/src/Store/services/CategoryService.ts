// src/services/CategoryService.ts
import apiClient from '../../Apis/apiConfig'; // asumiendo que apiClient ya está configurado

export interface Category {
  id: number;
  name: string;
}

export const getAllCategories = async (): Promise<Category[]> => {

  const response = await apiClient.get('/store/categories');

  return response.data;
};
