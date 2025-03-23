/* eslint-disable @typescript-eslint/no-unused-vars */
// src/Users/pages/MeasurementsPage.tsx

import React, { useEffect, useState } from 'react';
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Alert,
  Box,
  Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import measurementService from '../../Users/services/measurementService';
import { BodyMeasurement } from '../../Users/models/BodyMeasurement';
import { useAuth } from '../../Auth/hooks/useAuth';

const MeasurementsPage: React.FC = () => {
    const { login } = useAuth();
    console.log("Contenido de login:", login);
const user = login?.user || null
console.log("Usuario obtenido:", user);

  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.id) {
      measurementService
        .getMeasurements(user.id)
        .then((response) => {
            console.log(response.data);
          setMeasurements(response.data);
          setLoading(false);
        })
        .catch((err) => {
          setError('Error al obtener las mediciones.');
          setLoading(false);
        });
    } else {
      setError('Usuario no autenticado.');
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (measurements.length === 0) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <Alert severity="info">No hay mediciones disponibles.</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Mediciones Corporales
      </Typography>
      {measurements
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map((measurement) => (
          <Accordion key={measurement.id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>
                {new Date(measurement.date).toLocaleString([], {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
  <Grid container spacing={2}>
    <Grid item xs={12} sm={6}>
      <Typography variant="subtitle1"><strong>Peso:</strong> {measurement.weight} kg</Typography>
      <Typography variant="subtitle1"><strong>Altura:</strong> {measurement.height} cm</Typography>
      <Typography variant="subtitle1"><strong>Porcentaje de Grasa Corporal:</strong> {measurement.bodyFatPercentage} %</Typography>
      <Typography variant="subtitle1"><strong>IMC:</strong> {measurement.bmi}</Typography>
      <Typography variant="subtitle1"><strong>Pliegue Tríceps:</strong> {measurement.tricepFold} mm</Typography>
      <Typography variant="subtitle1"><strong>Pliegue Subescapular:</strong> {measurement.subscapularFold} mm</Typography>
      <Typography variant="subtitle1"><strong>Pliegue Biceps:</strong> {measurement.bicepFold} mm</Typography>
    </Grid>
    <Grid item xs={12} sm={6}>
      <Typography variant="subtitle1"><strong>Circunferencia Pantorrilla:</strong> {measurement.calf} cm</Typography>
      <Typography variant="subtitle1"><strong>Brazo Relajado:</strong> {measurement.relaxedArm} cm</Typography>
      <Typography variant="subtitle1"><strong>Brazo Flexionado:</strong> {measurement.flexedArm} cm</Typography>
      <Typography variant="subtitle1"><strong>Caderas:</strong> {measurement.hips} cm</Typography>
      <Typography variant="subtitle1"><strong>Masa Grasa:</strong> {measurement.fatMass} kg</Typography>
      <Typography variant="subtitle1"><strong>Masa Magra:</strong> {measurement.leanMass} kg</Typography>
      <Typography variant="subtitle1"><strong>Masa Muscular:</strong> {measurement.muscleMass} kg</Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography variant="subtitle1"><strong>Recomendaciones del Entrenador:</strong> {measurement.trainerRecommendations || 'N/A'}</Typography>
    </Grid>
  </Grid>
</AccordionDetails>

          </Accordion>
        ))}
    </Box>
  );
};

export default MeasurementsPage;
