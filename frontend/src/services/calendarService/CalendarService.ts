

// src/services/TrainerService.ts

import apiClient from '../../Apis/apiConfig';

export const getWeeklySlots = async (trainerId: number) => {
  try {
    const response = await apiClient.get(`/trainer-schedule/${trainerId}/weekly-slots`);
    console.log("aqui los horarios disponibles",response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los slots de tiempo:', error);
    throw error;
  }
};

/**
 * Reserva un slot de tiempo para un entrenador específico.
 * @param trainerId ID del entrenador.
 * @param slotStart ISO string de la hora de inicio del slot.
 * @returns Respuesta de la reserva.
 */
export const bookSlot = async (trainerId: number, slotStart: string) => {
    try {
      const response = await apiClient.post(
        '/trainer-schedule/book',
        null, // Enviar cuerpo vacío
        {
          params: { trainerId, slotStart }, // Enviar ambos como parámetros de consulta
        }
      );
      return response;
    } catch (error: any) {
      console.error('Error al reservar el slot:', error);
      throw error;
    }
  };
