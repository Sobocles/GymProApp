// src/api/groupClassService.ts
import apiClient from '../../Apis/apiConfig';

export interface CreateGroupClassData {
  className: string;
  startTime: string;   // formato ISO 8601, ej: '2024-12-19T08:00:00'
  endTime: string;
  maxParticipants: number;
}

export const createGroupClass = async (data: CreateGroupClassData) => {
  const response = await apiClient.post('/group-classes/create', data);
  return response.data;
};

export const assignTrainerToClass = async (classId: number, trainerId: number) => {
  const response = await apiClient.post(`/group-classes/${classId}/assign-trainer?trainerId=${trainerId}`);
  return response.data;
};
