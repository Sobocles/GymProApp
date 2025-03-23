// src/Trainers/services/trainerClientService.ts
import apiClient from '../../Apis/apiConfig';

export interface BodyMeasurement {
  weight: number;
  height: number;
  bodyFatPercentage: number;
  date: string; // Formato ISO: "YYYY-MM-DDTHH:mm:ss"
}

export interface RoutineRequest {
  title: string;
  description: string;
  assignedDate: string; // también en formato ISO
}

export const addBodyMeasurement = async (clientId: number, measurement: BodyMeasurement) => {
  const response = await apiClient.post(`/trainers/clients/${clientId}/measurements`, measurement);
  return response.data;
};

export const addRoutine = async (clientId: number, routine: RoutineRequest) => {
  const response = await apiClient.post(`/trainers/clients/${clientId}/routines`, routine);
  return response.data;
};
