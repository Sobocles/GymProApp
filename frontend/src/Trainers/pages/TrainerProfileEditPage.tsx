import React, { useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  Paper,
  Divider,
} from '@mui/material';
import { useAuth } from '../../Auth/hooks/useAuth';
import { updateTrainerProfile } from '../services/TrainerService';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { updateProfile } from '../../Auth/store/auth/authSlice';
import { useNavigate } from 'react-router-dom';


export const TrainerProfileEditPage: React.FC = () => {
  const { login } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Login User:', login.user);
  }, [login.user]);

  const validationSchema = Yup.object({
    username: Yup.string().required('El nombre de usuario es requerido'),
    email: Yup.string()
      .email('Correo electrónico no válido')
      .required('El correo es requerido'),
    password: Yup.string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres'),
    file: Yup.mixed().notRequired(),
    instagramUrl: Yup.string().notRequired(),
    whatsappNumber: Yup.string().notRequired(),
  });

  // Usa la información de login.user. Asegúrate de que si tienes información del entrenador esté en login.user.trainerInfo (o similar)
  const initialValues = {
    username: login.user?.username || '',
    email: login.user?.email || '',
    password: '',
    file: null as File | null,
    instagramUrl: login.user?.trainerDetails?.instagramUrl || '',
    whatsappNumber: login.user?.trainerDetails?.whatsappNumber || '',
  };
  
  

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    const formData = new FormData();
    formData.append('username', values.username);
    formData.append('email', values.email);
    
    if (values.password) {
      formData.append('password', values.password);
    }
    
    if (values.file) {
      formData.append('file', values.file);
    }
    
    // Agregamos los nuevos campos
    formData.append('instagramUrl', values.instagramUrl || '');
    formData.append('whatsappNumber', values.whatsappNumber || '');
    
    try {
      const updatedUser = await updateTrainerProfile(formData);
      console.log("Usuario/trainer actualizado:", updatedUser);
    
      dispatch(updateProfile(updatedUser));
      Swal.fire({
        icon: 'success',
        title: 'Perfil actualizado',
        text: 'Tu perfil ha sido actualizado exitosamente.',
      });
    } catch (error: any) {
      console.error('Error actualizando perfil:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data || 'Ocurrió un error al actualizar el perfil.',
      });
    } finally {
      setSubmitting(false);
    }
  };
  

  return (
    <Box
      sx={{
        p: 3,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        background: '#f5f5f5',
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 600 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Editar Perfil
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ handleChange, setFieldValue, values, isSubmitting, errors, touched }) => {
            useEffect(() => {
              if (values.file) {
                const objectUrl = URL.createObjectURL(values.file);
                return () => URL.revokeObjectURL(objectUrl);
              }
            }, [values.file]);

            return (
              <Form>
                <Box sx={{ mb: 2 }}>
                  <Field
                    as={TextField}
                    name="username"
                    label="Nombre de usuario"
                    fullWidth
                    variant="outlined"
                    helperText={<ErrorMessage name="username" />}
                    error={touched.username && Boolean(errors.username)}
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Field
                    as={TextField}
                    name="email"
                    type="email"
                    label="Correo electrónico"
                    fullWidth
                    variant="outlined"
                    helperText={<ErrorMessage name="email" />}
                    error={touched.email && Boolean(errors.email)}
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Field
                    as={TextField}
                    name="password"
                    type="password"
                    label="Nueva contraseña"
                    fullWidth
                    variant="outlined"
                    helperText={<ErrorMessage name="password" />}
                    error={touched.password && Boolean(errors.password)}
                  />
                </Box>
                <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Instagram"
                    name="instagramUrl"
                    value={values.instagramUrl}
                    onChange={handleChange}
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="WhatsApp"
                    name="whatsappNumber"
                    value={values.whatsappNumber}
                    onChange={handleChange}
                  />
                </Box>
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <Avatar
                    alt={login.user?.username}
                    src={
                      values.file
                        ? URL.createObjectURL(values.file)
                        : login.user?.profileImageUrl || ''
                    }
                    sx={{ width: 60, height: 60, mr: 2 }}
                  />
                  <Button variant="contained" component="label">
                    Subir Imagen
                    <input
                      type="file"
                      hidden
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        if (e.target.files && e.target.files[0]) {
                          setFieldValue('file', e.target.files[0]);
                        }
                      }}
                      accept="image/*"
                    />
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                  </Button>
                </Box>
              </Form>
            );
          }}
        </Formik>
      </Paper>
    </Box>
  );
};
export default TrainerProfileEditPage; 