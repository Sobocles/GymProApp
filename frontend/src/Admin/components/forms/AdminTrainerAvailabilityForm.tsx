import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2'; // Importación de SweetAlert2
import apiClient from '../../../Apis/apiConfig';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';

interface PersonalTrainerDto {
  id: number;
  username: string;
  email: string;
}

interface TrainerAvailabilityRequest {
  day: string;       // "YYYY-MM-DD"
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
}

const AdminTrainerAvailabilityForm: React.FC = () => {
  const [trainers, setTrainers] = useState<PersonalTrainerDto[]>([]);
  const [loadingTrainers, setLoadingTrainers] = useState(true);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await apiClient.get('/trainer-schedule/all-available');
        setTrainers(response.data);
      } catch (error: any) {
        Swal.fire('Error', 'Error al cargar entrenadores disponibles', 'error');
      } finally {
        setLoadingTrainers(false);
      }
    };
    fetchTrainers();
  }, []);

  const validationSchema = Yup.object({
    trainerId: Yup.number().required('Selecciona un entrenador'),
    day: Yup.date().required('Selecciona un día'),
    startTime: Yup.date().required('Selecciona la hora de inicio'),
    endTime: Yup.date()
      .required('Selecciona la hora de fin')
      .test(
        'is-after-start',
        'La hora de fin debe ser posterior a la hora de inicio',
        function (value) {
          const { startTime } = this.parent;
          return value && startTime && value > startTime;
        }
      ),
  });

  const formik = useFormik({
    initialValues: {
      trainerId: '',
      day: null as Date | null,
      startTime: null as Date | null,
      endTime: null as Date | null,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const dayStr = values.day ? format(values.day, 'yyyy-MM-dd') : '';
        const startTimeStr = values.startTime
          ? format(values.startTime, 'HH:mm')
          : '';
        const endTimeStr = values.endTime
          ? format(values.endTime, 'HH:mm')
          : '';

        const requestBody: TrainerAvailabilityRequest = {
          day: dayStr,
          startTime: startTimeStr,
          endTime: endTimeStr,
        };

        await apiClient.post(
          `/trainer-schedule/${values.trainerId}/availability`,
          requestBody
        );

        Swal.fire(
          'Éxito',
          'Disponibilidad creada con éxito',
          'success'
        );
        formik.resetForm();
      } catch (error: any) {
        Swal.fire(
          'Error',
          error.response?.data || 'Error al crear la disponibilidad',
          'error'
        );
      }
    },
  });

  if (loadingTrainers) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ maxWidth: 400, margin: '0 auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Crear Disponibilidad para Entrenador
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          select
          fullWidth
          margin="normal"
          label="Entrenador"
          name="trainerId"
          value={formik.values.trainerId}
          onChange={formik.handleChange}
          error={formik.touched.trainerId && Boolean(formik.errors.trainerId)}
          helperText={formik.touched.trainerId && formik.errors.trainerId}
        >
          <MenuItem value="">Seleccione un entrenador</MenuItem>
          {trainers.map((trainer) => (
            <MenuItem key={trainer.id} value={trainer.id}>
              {trainer.username} ({trainer.email})
            </MenuItem>
          ))}
        </TextField>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Día"
            value={formik.values.day}
            onChange={(value: Date | null) =>
              formik.setFieldValue('day', value)
            }
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                margin="normal"
                error={formik.touched.day && Boolean(formik.errors.day)}
                helperText={formik.touched.day && formik.errors.day}
              />
            )}
          />

          <TimePicker
            label="Hora inicio"
            value={formik.values.startTime}
            onChange={(value: Date | null) =>
              formik.setFieldValue('startTime', value)
            }
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                margin="normal"
                error={
                  formik.touched.startTime && Boolean(formik.errors.startTime)
                }
                helperText={formik.touched.startTime && formik.errors.startTime}
              />
            )}
          />

          <TimePicker
            label="Hora fin"
            value={formik.values.endTime}
            onChange={(value: Date | null) =>
              formik.setFieldValue('endTime', value)
            }
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                margin="normal"
                error={formik.touched.endTime && Boolean(formik.errors.endTime)}
                helperText={formik.touched.endTime && formik.errors.endTime}
              />
            )}
          />
        </LocalizationProvider>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" color="primary" type="submit">
            Guardar
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AdminTrainerAvailabilityForm;
