import React from 'react';
import { useFinancialData } from '../hooks/useFinancialData';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Container
} from '@mui/material';

export const DashboardAdmin: React.FC = () => {
  const { totalRevenue, adminRevenueData, loading, error } = useFinancialData();

  if (loading) return <p>Cargando datos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Título principal */}
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: 'bold' }}
      >
        Bienvenido al Dashboard del Administrador
      </Typography>

      <Grid container spacing={2}>
        {/* Card 1: Ingresos Totales */}
        {totalRevenue !== null && (
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent
                sx={{
                  backgroundColor: '#1976d2',
                  color: '#fff',
                  minHeight: '150px'
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Ingresos Totales
                </Typography>
                <Typography variant="body1">
                  <strong>Total:</strong>{' '}
                  {totalRevenue.toLocaleString('es-AR', {
                    style: 'currency',
                    currency: 'ARS'
                  })}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Card 2: Ingresos por Plan */}
        {adminRevenueData && (
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent
                sx={{
                  backgroundColor: '#1976d2',
                  color: '#fff',
                  minHeight: '150px'
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Ingresos por Plan
                </Typography>
                {Object.entries(adminRevenueData.planRevenue).map(([planName, amount]) => (
                  <Typography variant="body1" key={planName}>
                    {planName}:{' '}
                    {amount.toLocaleString('es-AR', {
                      style: 'currency',
                      currency: 'ARS'
                    })}
                  </Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Card 3: Ingresos por Tipo de Servicio */}
        {adminRevenueData && (
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent
                sx={{
                  backgroundColor: '#1976d2',
                  color: '#fff',
                  minHeight: '150px'
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Ingresos por Tipo de Servicio
                </Typography>
                <Typography variant="body1">
                  Entrenador Personal:{' '}
                  {adminRevenueData.serviceRevenue.personalTrainer.toLocaleString(
                    'es-AR',
                    { style: 'currency', currency: 'ARS' }
                  )}
                </Typography>
                <Typography variant="body1">
                  Plan + Entrenador:{' '}
                  {adminRevenueData.serviceRevenue.planAndTrainer.toLocaleString(
                    'es-AR',
                    { style: 'currency', currency: 'ARS' }
                  )}
                </Typography>
                <Typography variant="body1">
                  Solo Plan:{' '}
                  {adminRevenueData.serviceRevenue.plan.toLocaleString('es-AR', {
                    style: 'currency',
                    currency: 'ARS'
                  })}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default DashboardAdmin;
