// src/api/groupClassService.ts

import apiClient from '../../Apis/apiConfig';
import { GroupClass } from '../interfaces/GroupClass';



export const getAvailableGroupClasses = async (): Promise<GroupClass[]> => {
  const response = await apiClient.get('/group-classes/available');
  return response.data;
};

export const bookGroupClass = async (classId: number) => {
  const response = await apiClient.post(`/group-classes/${classId}/book`);
  return response.data;
};


