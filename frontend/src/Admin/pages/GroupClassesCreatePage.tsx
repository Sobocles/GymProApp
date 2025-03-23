import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Typography, Container, MenuItem, FormControl, InputLabel, Select, CircularProgress, Alert } from '@mui/material';
import { DatePicker, TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import Swal from 'sweetalert2';
import { useGroupClasses } from '../../Admin/hooks/useGroupClasses';
import { fetchAvailableTrainers } from '../../Admin/services/AvailabilityRequest';

export const GroupClassesCreatePage: React.FC = () => {
  const { handleCreateClass, loading, error } = useGroupClasses();
  const [availableTrainers, setAvailableTrainers] = useState([]);
  const [loadingTrainers, setLoadingTrainers] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

 
  const validationSchema = Yup.object({
    className: Yup.string().required('El nombre de la clase es requerido'),
    day: Yup.date().required('Selecciona un día'),
    startTime: Yup.date().required('Selecciona la hora de inicio'),
    endTime: Yup.date()
      .required('Selecciona la hora de fin')
      .test('is-after-start', 'La hora de fin debe ser después de la hora de inicio', function (value) {
        const { startTime } = this.parent;
        return value && startTime && value > startTime;
      }),
    maxParticipants: Yup.number()
      .required('El número máximo de participantes es requerido')
      .min(1, 'Debe ser mayor a 0'),
    trainerId: Yup.number().required('Selecciona un entrenador'),
  });

  const formik = useFormik({
    initialValues: {
      className: '',
      day: null as Date | null,
      startTime: null as Date | null,
      endTime: null as Date | null,
      maxParticipants: 20,
      trainerId: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setSubmitError(null);
      setSubmitSuccess(false);

      try {
        const dayStr = values.day ? format(values.day, 'yyyy-MM-dd') : '';
        const startTimeStr = values.startTime ? format(values.startTime, 'HH:mm') : '';
        const endTimeStr = values.endTime ? format(values.endTime, 'HH:mm') : '';

        const requestData = {
          className: values.className,
          day: dayStr,
          startTime: startTimeStr,
          endTime: endTimeStr,
          maxParticipants: values.maxParticipants,
          trainerId: values.trainerId,
        };

        await handleCreateClass(requestData);
        Swal.fire({
          title: 'Clase creada con éxito',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        formik.resetForm();
        setSubmitSuccess(true);
      } catch (err: any) {
        setSubmitError('Error al crear la clase');
      }
    },
  });

  useEffect(() => {
    const fetchTrainers = async () => {
      if (formik.values.day && formik.values.startTime && formik.values.endTime) {
        setLoadingTrainers(true);
        try {
          const dayStr = format(formik.values.day, 'yyyy-MM-dd');
          const startTimeStr = format(formik.values.startTime, 'HH:mm');
          const endTimeStr = format(formik.values.endTime, 'HH:mm');
  
          const trainers = await fetchAvailableTrainers(dayStr, startTimeStr, endTimeStr);
          setAvailableTrainers(trainers);
        } catch (err) {
          setFetchError('Error al obtener entrenadores disponibles');
        } finally {
          setLoadingTrainers(false);
        }
      }
    };
  
    fetchTrainers();
  }, [formik.values.day, formik.values.startTime, formik.values.endTime]); 


  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Crear Clase Grupal
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Nombre de la Clase"
          name="className"
          value={formik.values.className}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.className && Boolean(formik.errors.className)}
          helperText={formik.touched.className && formik.errors.className}
          margin="normal"
        />

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Día de la Clase"
            value={formik.values.day}
            onChange={(newValue) => formik.setFieldValue('day', newValue)}
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
  label="Hora de Inicio"
  value={formik.values.startTime}
  ampm={true}  // Habilitar AM/PM
  onChange={(newValue) => formik.setFieldValue('startTime', newValue)}
  renderInput={(params) => (
    <TextField
      {...params}
      fullWidth
      margin="normal"
      error={formik.touched.startTime && Boolean(formik.errors.startTime)}
      helperText={formik.touched.startTime && formik.errors.startTime}
    />
  )}
/>

<TimePicker
  label="Hora de Fin"
  value={formik.values.endTime}
  ampm={true}  // Habilitar AM/PM
  onChange={(newValue) => formik.setFieldValue('endTime', newValue)}
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

        <TextField
          fullWidth
          label="Máximo de participantes"
          name="maxParticipants"
          type="number"
          value={formik.values.maxParticipants}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.maxParticipants && Boolean(formik.errors.maxParticipants)}
          helperText={formik.touched.maxParticipants && formik.errors.maxParticipants}
          margin="normal"
        />

        <FormControl fullWidth margin="normal">
          <InputLabel id="trainer-select-label">Entrenador Disponible</InputLabel>
          <Select
            labelId="trainer-select-label"
            id="trainerId"
            name="trainerId"
            value={formik.values.trainerId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            {availableTrainers.map((trainer) => (
              <MenuItem key={trainer.id} value={trainer.id}>
                {trainer.username}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {submitError && <Alert severity="error">{submitError}</Alert>}
        {submitSuccess && <Alert severity="success">Clase creada con éxito</Alert>}

        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Crear Clase
        </Button>
      </Box>
    </Container>
  );
};
