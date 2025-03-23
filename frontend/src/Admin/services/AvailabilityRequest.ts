// src/Admin/services/availabilityService.ts

import apiClient from '../../Apis/apiConfig';

export interface PersonalTrainerDto {
  id: number;
  username: string;
  email: string;
  specialization: string;
  experienceYears: number;
  availability: boolean;
  profileImageUrl: string;
  title: string;
  studies: string;
  certifications: string;
  description: string;
}

export interface TrainerAvailabilityRequest {
  day: string;       // "YYYY-MM-DD"
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
}

export const fetchAvailableTrainers = async (
  day: string,        // "YYYY-MM-DD"
  startTime: string,  // "HH:mm"
  endTime: string     // "HH:mm"
): Promise<PersonalTrainerDto[]> => {
  const response = await apiClient.get('/trainer-schedule/available', {  
    params: { day, startTime, endTime },
  });
  console.log("ACA LA RESPONSE", response);
  return response.data;
};
