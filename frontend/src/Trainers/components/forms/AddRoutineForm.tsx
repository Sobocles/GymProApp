// src/Trainers/components/forms/AddRoutineForm.tsx
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box, Button, TextField, Typography, Alert
} from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { addRoutine } from '../../services/trainerClientService';

interface AddRoutineFormProps {
  clientId: number;
}

const AddRoutineForm: React.FC<AddRoutineFormProps> = ({ clientId }) => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  const validationSchema = Yup.object({
    title: Yup.string().required('El título es requerido'),
    description: Yup.string().required('La descripción es requerida'),
    assignedDate: Yup.date().required('La fecha de asignación es requerida')
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      assignedDate: new Date(),
    },
    validationSchema,
    onSubmit: async (values) => {
      setSubmitError(null);
      setSubmitSuccess(false);
      try {
        const dateStr = values.assignedDate ? format(values.assignedDate, "yyyy-MM-dd'T'HH:mm:ss") : '';
        await addRoutine(clientId, {
          title: values.title,
          description: values.description,
          assignedDate: dateStr,
        });
        setSubmitSuccess(true);
        formik.resetForm();
      } catch (error: any) {
        console.error('Error al agregar rutina:', error);
        setSubmitError(error.response?.data || 'Error al agregar la rutina');
      }
    },
  });

  return (
    <Box sx={{ maxWidth: 400, margin: '0 auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Agregar Rutina</Typography>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Título de la rutina"
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          error={formik.touched.title && Boolean(formik.errors.title)}
          helperText={formik.touched.title && formik.errors.title}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Descripción"
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          error={formik.touched.description && Boolean(formik.errors.description)}
          helperText={formik.touched.description && formik.errors.description}
          multiline
          rows={4}
        />

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            label="Fecha y Hora de asignación"
            value={formik.values.assignedDate}
            onChange={(value: Date | null) => formik.setFieldValue('assignedDate', value)}
            renderInput={(params: any) => (
              <TextField
                {...params}
                fullWidth
                margin="normal"
                error={formik.touched.assignedDate && Boolean(formik.errors.assignedDate)}
                helperText={formik.touched.assignedDate && formik.errors.assignedDate}
              />
            )}
          />
        </LocalizationProvider>

        {submitError && <Alert severity="error" sx={{ mt: 2 }}>{submitError}</Alert>}
        {submitSuccess && <Alert severity="success" sx={{ mt: 2 }}>Rutina añadida con éxito</Alert>}

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" color="primary" type="submit">
            Guardar
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddRoutineForm;
