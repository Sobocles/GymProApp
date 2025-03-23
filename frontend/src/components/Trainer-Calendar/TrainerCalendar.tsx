/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/Calendar/TrainerCalendar.tsx
import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer, SlotInfo, Event } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay, startOfDay } from 'date-fns';
import { enUS, es } from 'date-fns/locale';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import apiClient from '../../Apis/apiConfig';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, Alert, CircularProgress } from '@mui/material';
import { getWeeklySlots, bookSlot } from '../../services/calendarService/CalendarService';
import { format as formatDate } from 'date-fns';

// Definición de locales para React Big Calendar
const locales = {
  'en-US': enUS,
  'es': es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), 
  getDay,
  locales,
});

// Booking Interface
interface Booking {
  id: number;
  startDateTime: string;
}

// TimeSlot Interface
interface TimeSlot {
  trainerId: number;
  startDateTime: string; // ISO string
  endDateTime: string;   // ISO string
  available: boolean;
}

// CalendarEvent extiende Event y agrega slotId
interface CalendarEvent extends Event {
  slotId: string;
}

const TrainerCalendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<{
    open: boolean;
    severity: 'success' | 'error';
    message: string;
  }>({
    open: false,
    severity: 'success',
    message: '',
  });

  const [trainerId, setTrainerId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [existingBooking, setExistingBooking] = useState<Booking | null>(null);

  // Del store
  const email = useSelector((state: RootState) => state.auth.user?.email);
  const token = useSelector((state: RootState) => state.auth.token);

  // Interceptor con token
  useEffect(() => {
    console.log("Aqui calendario usuario")
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log("[useEffect - token] Token actualizado:", token);
    }
  }, [token]);

  // Función para obtener los slots
  const fetchTimeSlots = async (trainerId: number) => {
    console.log("[fetchTimeSlots] Iniciando fetch de slots para trainerId:", trainerId);
    try {
      const timeSlots: TimeSlot[] = await getWeeklySlots(trainerId);
      console.log("[fetchTimeSlots] timeSlots desde backend:", timeSlots);

      // Filtrar solo los 'available'
      const availableSlots = timeSlots.filter(slot => slot.available);
      console.log("[fetchTimeSlots] availableSlots:", availableSlots);

      // Mapeo a formato BigCalendar
      const calendarEvents: CalendarEvent[] = availableSlots.map(slot => ({
        title: 'Disponible',
        start: new Date(slot.startDateTime),
        end: new Date(slot.endDateTime),
        allDay: false,
        slotId: slot.startDateTime
      }));
      console.log("[fetchTimeSlots] calendarEvents generados:", calendarEvents);

      setEvents(calendarEvents);
      setLoading(false);
    } catch (err) {
      console.error('Error al obtener los slots:', err);
      setError('No se pudieron obtener los horarios disponibles.');
      setLoading(false);
    }
  };

  // Cargar trainerId y slots cuando se monta
  useEffect(() => {
    const fetchTrainerId = async () => {
      try {
        const response = await apiClient.get('/users/personal-trainer');
        console.log("Trainer Data:", response.data);
        setTrainerId(response.data.id);
        return response.data.id;
      } catch (err) {
        console.error('Error al obtener el entrenador personal:', err);
        setError('No se pudo obtener el entrenador personal asignado.');
        return null;
      }
    };

    const initializeCalendar = async () => {
      console.log("[initializeCalendar] Iniciando carga del calendario para email:", email);
      if (email) {
        const fetchedTrainerId = await fetchTrainerId();
        console.log("aqui fetchedTrainerId",fetchedTrainerId);
        if (fetchedTrainerId) {
          await fetchTimeSlots(fetchedTrainerId);
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    initializeCalendar();
  }, [email]);

  // Al hacer clic en un event (slot disponible)
  const handleSelectEvent = async (event: CalendarEvent) => {
    console.log("Al hacer clic en un event (slot disponible)");
    const slotInfo: SlotInfo = {
      start: event.start!,  
      end: event.end!,
      slots: [event.start!],
      action: 'select',
    };
    setSelectedSlot(slotInfo);

    try {
      // Se usa startOfDay solo para verificar si ya existe reserva ese día
      // (Dependiendo de tu backend, ajusta según la lógica)
      const slotStartFormatted = formatDate(startOfDay(slotInfo.start), "yyyy-MM-dd'T'HH:mm:ss");
      console.log("slotStartFormatted",slotStartFormatted);

      const response = await apiClient.get(`/trainer-schedule/${trainerId}/existing-booking`, {
        params: { slotStart: slotStartFormatted },
      });

      console.log("[handleSelectEvent] existing-booking response:", response);

      const existing = response.data;
      console.log("existing",existing);

      setExistingBooking(existing || null);
    } catch (err) {
      console.error('Error al verificar reserva existente:', err);
      setExistingBooking(null);
    }

    setOpenDialog(true);
  };


  const handleSelectSlot = (slotInfo: SlotInfo) => {
    console.log("Al hacer clic en un slot vacío");
    setBookingStatus({
      open: true,
      severity: 'error',
      message: 'Este horario no está disponible para reserva.',
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedSlot(null);
  };

  // Confirmar reserva
  const handleConfirmBooking = async () => {
    console.log("Confirmar reserva");
    if (selectedSlot && trainerId) {
        try {
            const localSlotStart = format(selectedSlot.start, "yyyy-MM-dd'T'HH:mm:ss");
            console.log("AQUI localSlotStart ", localSlotStart);

            // Verificar si ya existe una reserva
            const response = await apiClient.get(`/trainer-schedule/${trainerId}/existing-booking`, {
                params: { slotStart: localSlotStart },
            });
            console.log("Verificar si existe una reserva", response);

            const existingBooking = response.data;

            if (existingBooking) {
                const confirmModification = window.confirm(
                    `Ya tienes una reserva el ${new Date(existingBooking.startDateTime).toLocaleDateString()}
                     a las ${new Date(existingBooking.startDateTime).toLocaleTimeString()}. 
                     ¿Quieres modificarla por este horario?`
                );

                if (!confirmModification) return;

                await apiClient.delete(`/trainer-schedule/cancel-booking/${existingBooking.id}`);

                const bookingResponse = await bookSlot(trainerId, localSlotStart);

                if (bookingResponse.status === 200) {
                    await fetchTimeSlots(trainerId);
                    setBookingStatus({
                        open: true,
                        severity: 'success',
                        message: 'Reserva modificada con éxito.',
                    });
                }
            } else {
                const bookingResponse = await bookSlot(trainerId, localSlotStart);
                if (bookingResponse.status === 200) {
                    await fetchTimeSlots(trainerId);
                    setBookingStatus({
                        open: true,
                        severity: 'success',
                        message: 'Reserva realizada con éxito.',
                    });
                }
            }
        } catch (error: any) {
            console.error('Error al reservar el slot:', error);
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                'Error desconocido al reservar el horario';

            setBookingStatus({
                open: true,
                severity: 'error',
                message: errorMessage,
            });
        } finally {
            handleCloseDialog();
        }
    }
};


  const handleCloseSnackbar = () => {
    setBookingStatus(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Alert severity="error" style={{ marginTop: '20px' }}>
        {error}
      </Alert>
    );
  }

  return (
    <div>
      <h2>Calendario de Entrenador Personal</h2>

      {trainerId ? (
        <Calendar
  localizer={localizer}
  events={events}
  startAccessor="start"
  endAccessor="end"
  style={{ height: 600 }}
  selectable
  onSelectSlot={handleSelectSlot}
  onSelectEvent={handleSelectEvent}
  views={['week']}
  defaultView="week"
  popup
  eventPropGetter={() => ({
    style: {
      backgroundColor: 'green',
      color: 'white',
    },
  })}
/>

      ) : (
        <Alert severity="warning">
          No tienes un entrenador personal asignado.
        </Alert>
      )}

      {/* Diálogo de Confirmación */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmar Reserva</DialogTitle>
        <DialogContent>
          {existingBooking ? (
            <DialogContentText>
              Ya tienes una reserva el <strong>{new Date(existingBooking.startDateTime).toLocaleDateString()}</strong> 
              a las <strong>{new Date(existingBooking.startDateTime).toLocaleTimeString()}</strong>.
              ¿Quieres modificarla por este horario?
            </DialogContentText>
          ) : (
            <DialogContentText>
              ¿Estás seguro de que deseas reservar este horario?
            </DialogContentText>
          )}
          {selectedSlot && (
            <div>
              <p><strong>Fecha:</strong> {selectedSlot.start.toLocaleDateString()}</p>
              <p><strong>Hora:</strong> 
                {selectedSlot.start.toLocaleTimeString()} - {selectedSlot.end.toLocaleTimeString()}
              </p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmBooking} color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={bookingStatus.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={bookingStatus.severity}
          sx={{ width: '100%' }}
        >
          {bookingStatus.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default TrainerCalendar;
