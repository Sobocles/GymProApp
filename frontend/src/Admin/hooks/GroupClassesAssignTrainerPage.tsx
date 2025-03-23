// src/Admin/pages/GroupClassesAssignTrainerPage.tsx
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Typography, Container } from '@mui/material';
import { useGroupClasses } from '../../Admin/hooks/useGroupClasses';

const validationSchema = Yup.object({
  classId: Yup.number().required('El ID de la clase es requerido'),
  trainerId: Yup.number().required('El ID del entrenador es requerido'),
});

export const GroupClassesAssignTrainerPage: React.FC = () => {
  const { handleAssignTrainer, loading, error } = useGroupClasses();

  const formik = useFormik({
    initialValues: {
      classId: 0,
      trainerId: 0,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await handleAssignTrainer(values.classId, values.trainerId);
        alert('Entrenador asignado con éxito');
        formik.resetForm();
      } catch (err: any) {
        console.error('Error al asignar entrenador:', err);
      }
    },
  });

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Asignar Entrenador a Clase
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="ID de la Clase"
          name="classId"
          type="number"
          value={formik.values.classId}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.classId && Boolean(formik.errors.classId)}
          helperText={formik.touched.classId && formik.errors.classId}
          margin="normal"
        />
        <TextField
          fullWidth
          label="ID del Entrenador"
          name="trainerId"
          type="number"
          value={formik.values.trainerId}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.trainerId && Boolean(formik.errors.trainerId)}
          helperText={formik.touched.trainerId && formik.errors.trainerId}
          margin="normal"
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? 'Asignando...' : 'Asignar Entrenador'}
        </Button>
      </Box>
    </Container>
  );
};
