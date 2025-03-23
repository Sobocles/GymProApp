// src/Trainers/pages/TrainerDashboard.tsx
import React, { useEffect, useState } from 'react';
import { getActiveClientsInfo, ActiveClientInfo } from '../../Trainers/services/TrainerService';
// Importar componentes de Material UI
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  CardActions, 
  Divider 
} from '@mui/material';

const TrainerDashboard: React.FC = () => {
  const [clients, setClients] = useState<ActiveClientInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActiveClients = async () => {
      try {
        const data = await getActiveClientsInfo();
        setClients(data);
      } catch (err) {
        console.error('[TrainerDashboard] Error fetching clients info:', err);
        setError('Ocurrió un error al cargar la información de clientes.');
      } finally {
        setLoading(false);
      }
    };

    fetchActiveClients();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Cargando información de clientes...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Bienvenido a tu Dashboard (Entrenador)
      </Typography>

      {clients.length === 0 ? (
        <Typography variant="body1">No hay clientes activos en este momento.</Typography>
      ) : (
        <Grid container spacing={2}>
          {clients.map((client) => (
            <Grid item xs={12} sm={6} md={4} key={client.clientId}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {client.clientName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {client.clientEmail}
                  </Typography>

                  <Divider sx={{ my: 1 }} />

                  {/* Plan */}
                  <Typography variant="subtitle2" sx={{ mt: 1 }}>
                    <strong>Plan:</strong> {client.planName || '—'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Inicio: {client.planStart ?? '—'} <br />
                    Fin: {client.planEnd ?? '—'}
                  </Typography>

                  <Divider sx={{ my: 1 }} />

                  {/* Entrenador */}
                  <Typography variant="subtitle2">
                    <strong>Entrenador:</strong> 
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Inicio: {client.trainerStart ?? '—'} <br />
                    Fin: {client.trainerEnd ?? '—'}
                  </Typography>
                </CardContent>

                <CardActions sx={{ mt: 'auto', p: 2 }}>
                  {/* Botones de acción que desees (por ejemplo, ver perfil del cliente o registrar medición). */}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default TrainerDashboard;
