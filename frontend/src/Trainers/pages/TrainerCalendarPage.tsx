import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS, es } from 'date-fns/locale';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { getTrainerCalendarEvents, TrainerCalendarEvent } from '../services/TrainerService';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';

// Config locales
const locales = {
  'en-US': enUS,
  es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

// Interfaz para usar en React Big Calendar (son las props mínimas del Event)
interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  eventType: string; // "PERSONAL" | "GROUP"
}

// La página
const TrainerCalendarPage: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);

  // Roles y token del usuario
  const { user, token, roles } = useSelector((state: RootState) => state.auth);
  // Si en tu back integras un endpoint para /trainer-schedule/{trainerId}, 
  // aquí podrías sacar la info de trainerId.
  // Podrías obtener trainerId desde user?.id o de otra parte si tu back asume que user.id = trainerId
  // o tuviste que hacer un "GET /trainers" para ver si hay un personalTrainer asociado.

  // Supongamos que si es trainer, su "id" es también "trainerId" en PersonalTrainer. 
  // (puede que difieran, pero para el ejemplo haremos lo más sencillo)
  const trainerId = user?.id;  // Accede directamente desde el usuario autenticado
 
    console.log("AQUI ESTA EL ID DEL ENTRENADOR",trainerId);
  useEffect(() => {
    console.log("aqui calendario usuario");
    const fetchEvents = async () => {
        console.log("AQUI ESTA EL ID DEL ENTRENADOR",trainerId);
      if (!trainerId) {
        setError('No se encontró el ID del entrenador');
        setLoading(false);
        return;
      }
      try {
        const data = await getTrainerCalendarEvents(trainerId);
        console.log("aqui la data",data)
        const mappedEvents: CalendarEvent[] = data.map((evt) => ({
          id: evt.id,
          title: evt.title,
          start: new Date(evt.start),
          end:   new Date(evt.end),
          eventType: evt.eventType,
        }));
        setEvents(mappedEvents);
      } catch (err) {
        setError('Error al cargar el calendario del entrenador');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [trainerId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Mi Calendario (Entrenador)
      </Typography>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        defaultView="week"
        views={['week', 'day', 'agenda', 'month']}
        eventPropGetter={(event: CalendarEvent) => {
          // cambiar color si es personal o grupal
          let backgroundColor = event.eventType === 'PERSONAL' ? '#1976d2' : '#d81b60'; // por ejemplo
          return {
            style: {
              backgroundColor,
              color: '#fff',
            },
          };
        }}
      />
    </Box>
  );
};

export default TrainerCalendarPage;
