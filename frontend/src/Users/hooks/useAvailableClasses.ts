/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/hooks/useAvailableClasses.ts
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';  // Importar SweetAlert
import { getAvailableGroupClasses, bookGroupClass } from '../../Users/services/groupClassService';
import { GroupClass } from '../interfaces/GroupClass';

export const useAvailableClasses = () => {
  const [classes, setClasses] = useState<GroupClass[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAvailableGroupClasses();
      setClasses(data);
    } catch (err: any) {
      setError('Error al obtener las clases disponibles');
    } finally {
      setLoading(false);
    }
  };

  const bookClassById = async (classId: number) => {
    try {
      setLoading(true);
      setError(null);
      await bookGroupClass(classId);
      
      // Mostrar SweetAlert en caso de éxito
      Swal.fire({
        title: 'Reserva exitosa',
        text: 'Has reservado con éxito. Por favor, llega 5 minutos antes de la clase.',
        icon: 'success',
        confirmButtonText: 'Entendido'
      });

      // Refrescar la lista automáticamente después de reservar
      await fetchClasses();  
      
    } catch (err: any) {
      // Si el error es porque ya tiene una reserva
      if (err.response && err.response.data === "Ya tienes una reserva en esta clase") {
        Swal.fire({
          title: 'Reserva duplicada',
          text: 'Ya tienes una reserva para esta clase.',
          icon: 'info',
          confirmButtonText: 'OK'
        });
      } else {
        // Mensaje genérico para otros errores
        Swal.fire({
          title: 'Error al reservar',
          text: 'Hubo un problema al intentar reservar la clase. Verifica tu plan activo o el rango de reserva.',
          icon: 'error',
          confirmButtonText: 'Entendido'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return { classes, loading, error, bookClassById };
};
