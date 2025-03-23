// src/Admin/pages/GymInfoForm.tsx
import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Stack
} from '@mui/material';
import { createGymInfo, getGymInfo, updateGymInfo } from '../../Admin/services/gymInfoService';
import EditIcon from '@mui/icons-material/Edit';

export interface GymInfoValues {
  id?: number;
  gymName: string;
  address: string;
  phone: string;
  email: string;
  instagram: string;
  facebook: string;
  whatsapp: string;
  twitter: string;
}

const GymInfoSchema = Yup.object().shape({
  gymName: Yup.string().required('El nombre del gym es requerido'),
  address: Yup.string().required('La dirección es requerida'),
  phone: Yup.string().required('El teléfono es requerido'),
  email: Yup.string().email('Email inválido').required('El email es requerido'),
  instagram: Yup.string().url('URL inválida').notRequired(),
  facebook: Yup.string().url('URL inválida').notRequired(),
  twitter: Yup.string().url('URL inválida').notRequired(),
});

const GymInfoForm: React.FC = () => {
  const [initialValues, setInitialValues] = useState<GymInfoValues>({
    gymName: '',
    address: '',
    phone: '',
    email: '',
    instagram: '',
    facebook: '',
    whatsapp: '',
    twitter: '',
  });

  const [openModal, setOpenModal] = useState(false);
  const [existingData, setExistingData] = useState<GymInfoValues | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getGymInfo();
        console.log("aqui esta la data",data);
        if (data) {
          setInitialValues(data);
          setExistingData(data);
        }
      } catch (error) {
        console.error('Error cargando información:', error);
      }
    };
    fetchData();
  }, []);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleSubmit = async (values: GymInfoValues) => {
    try {
      let savedData;
      if (values.id) {
        savedData = await updateGymInfo(values.id, values);
      } else {
        savedData = await createGymInfo(values);
      }
      setInitialValues(savedData);
      setExistingData(savedData);
      handleCloseModal();
    } catch (error) {
      console.error('Error guardando:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: '2rem auto', padding: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Información del Gym
      </Typography>

      {existingData ? (
        <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
          <Stack spacing={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Información Actual</Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                onClick={handleOpenModal}
              >
                Editar
              </Button>
            </Box>
            
            <Typography><strong>Nombre:</strong> {existingData.gymName}</Typography>
            <Typography><strong>Dirección:</strong> {existingData.address}</Typography>
            <Typography><strong>Teléfono:</strong> {existingData.phone}</Typography>
            <Typography><strong>Email:</strong> {existingData.email}</Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6">Redes Sociales</Typography>
            {existingData.instagram && <Typography><strong>Instagram:</strong> {existingData.instagram}</Typography>}
            {existingData.facebook && <Typography><strong>Facebook:</strong> {existingData.facebook}</Typography>}
            {existingData.whatsapp && <Typography><strong>WhatsApp:</strong> {existingData.whatsapp}</Typography>}
            {existingData.twitter && <Typography><strong>Twitter:</strong> {existingData.twitter}</Typography>}
          </Stack>
        </Paper>
      ) : (
        <Box textAlign="center" mb={3}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleOpenModal}
          >
            Crear Información del Gym
          </Button>
        </Box>
      )}

      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="md">
        <DialogTitle>
          {existingData ? 'Editar Información del Gym' : 'Crear Información del Gym'}
        </DialogTitle>
        
        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          validationSchema={GymInfoSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            isSubmitting,
          }) => (
            <Form>
              <DialogContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="gymName"
                      name="gymName"
                      label="Nombre del Gym"
                      value={values.gymName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.gymName && Boolean(errors.gymName)}
                      helperText={touched.gymName && errors.gymName}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="address"
                      name="address"
                      label="Dirección"
                      value={values.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.address && Boolean(errors.address)}
                      helperText={touched.address && errors.address}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="phone"
                      name="phone"
                      label="Teléfono"
                      value={values.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.phone && Boolean(errors.phone)}
                      helperText={touched.phone && errors.phone}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="email"
                      name="email"
                      label="Email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ margin: '1rem 0' }} />
                    <Typography variant="h6" align="center">
                      Redes Sociales
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="instagram"
                      name="instagram"
                      label="Instagram URL"
                      value={values.instagram}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.instagram && Boolean(errors.instagram)}
                      helperText={touched.instagram && errors.instagram}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="facebook"
                      name="facebook"
                      label="Facebook URL"
                      value={values.facebook}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.facebook && Boolean(errors.facebook)}
                      helperText={touched.facebook && errors.facebook}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="whatsapp"
                      name="whatsapp"
                      label="Whatsapp URL"
                      value={values.whatsapp}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.whatsapp && Boolean(errors.whatsapp)}
                      helperText={touched.whatsapp && errors.whatsapp}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="twitter"
                      name="twitter"
                      label="Twitter URL"
                      value={values.twitter}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.twitter && Boolean(errors.twitter)}
                      helperText={touched.twitter && errors.twitter}
                    />
                  </Grid>
                </Grid>
              </DialogContent>

              <DialogActions>
                <Button onClick={handleCloseModal}>Cancelar</Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                >
                  {existingData ? 'Actualizar' : 'Crear'}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </Box>
  );
};

export default GymInfoForm;