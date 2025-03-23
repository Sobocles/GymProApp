// src/Trainers/services/TrainerService.ts

import { UserInterface } from '../../Auth/Interfaces/UserInterface';
import apiClient from '../../Apis/apiConfig';


// src/Trainers/services/TrainerService.ts

export const updateTrainerProfile = async (formData: FormData): Promise<UserInterface> => {
  console.log("AQUI ESTA LA DATA (Formulario):", {
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
    file: formData.get('file'),
  });
  
  const token = sessionStorage.getItem('token');
  
  if (!token) {
    throw new Error('Token de autenticación no encontrado');
  }

  const response = await apiClient.put<UserInterface>('/profile/update', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("Respuesta del servidor:", response.data);
  return response.data; // Retorna solo los datos del usuario
};



export const getClients = async () => {
  try {
    const response = await apiClient.get('/trainers/clients');
    console.log("AQUI LOS USUARIOS",response);
    return response.data;
  } catch (error) {
    console.error('[TrainerClientService] Error fetching clients:', error);
    throw error;
  }
};

export interface ActiveClientInfo {
  clientId: number;
  clientName: string;
  clientEmail: string;
  planName?: string;
  planStart?: string;  
  planEnd?: string;      
  trainerStart?: string;  
  trainerEnd?: string;    
}

export const getActiveClientsInfo = async (): Promise<ActiveClientInfo[]> => {
  const response = await apiClient.get('/trainers/active-clients-info');
  return response.data;
};

export interface TrainerCalendarEvent {
  id: number;
  title: string;
  start: string;  // ISO date string
  end:   string;  // ISO date string
  eventType: 'PERSONAL' | 'GROUP';  // o el string que tu backend devuelva
}

/**
 * Obtiene TODOS los eventos (personales + grupales) del entrenador con ID `trainerId`.
 */
export const getTrainerCalendarEvents = async (trainerId: number): Promise<TrainerCalendarEvent[]> => {
  const response = await apiClient.get(`/trainer-schedule/${trainerId}/calendar`);
  console.log("ACA LA RESPONSE",response);
  return response.data;
};

