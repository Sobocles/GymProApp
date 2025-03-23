import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import es from 'date-fns/locale/es';
import apiClient from '../../Apis/apiConfig';
import { CalendarEventDTO } from '../../Users/interfaces/GroupClass';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const locales = {
  'es': es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const TrainerSessionsCalendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEventDTO[]>([]);

  // Obtener el ID del usuario autenticado desde Redux
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  useEffect(() => {
    const fetchSessions = async () => {
      console.log("aqui el id del usuario",userId);
      if (!userId) return;

      try {
        const response = await apiClient.get(`/clients/${userId}/sessions`);
        console.log("aqui las sesiones",response);
        const sessions = response.data.map((event: CalendarEventDTO) => ({
          title: event.title,
          start: new Date(event.start),
          end: new Date(event.end),
        }));
        setEvents(sessions);
      } catch (error) {
        console.error('Error al cargar las sesiones:', error);
      }
    };

    fetchSessions();
  }, [userId]);

  return (
    <div style={{ height: 700 }}>
      <h2 style={{ textAlign: 'center' }}>Calendario de Sesiones</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ margin: '50px' }}
        views={['week']}             // Solo mostramos la vista de semana
        defaultView="week"           // Vista por defecto 'week'
      />
    </div>
  );
};

export default TrainerSessionsCalendar;
