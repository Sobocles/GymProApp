import React, { useEffect, useState } from 'react';
import { Typography, Box, Paper, Grid, Table, TableHead, TableBody, TableCell, TableRow, TableContainer } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import apiClient from '../../Apis/apiConfig';

interface Subscription {
  id: number;
  plan?: {
    id: number;
    name: string;
    price: number;
  };
  startDate: string;
  endDate: string;
  active: boolean;
}

interface TrainerSubscription {
  id: number;
  startDate: string;
  endDate: string;
  active: boolean;
  personalTrainer: {
    id: number;
    specialization: string;
    monthlyFee: number;
    user: {
      username: string;
      email: string;
      profileImageUrl?: string | null;
    };
  };
}

interface PaymentDTO {
  id: number;
  planName: string;
  paymentType: string;
  paymentDate?: string;
  paymentMethod: string;
  transactionAmount: number;
  products?: {
    name: string;
    price: number;
    brand?: string;
    paymentMethod?: string;
  }[];
}

interface DashboardData {
  planSubscriptions: Subscription[];
  payments: PaymentDTO[];
  trainerSubscriptions: TrainerSubscription[];
}

export const UserDashboard: React.FC = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) return;
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await apiClient.get('/users/dashboard', config);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchDashboardData();
  }, [token]);

  const planPayments = (data?.payments ?? []).filter(pay => pay.paymentType === 'plan');
  const productPayments = (data?.payments ?? []).filter(pay => pay.paymentType === 'producto');

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Bienvenido al Dashboard de Usuario
      </Typography>

      {data && (
        <>
          <Grid container spacing={3} sx={{ mt: 4 }}>
            {/* Suscripciones al Plan */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ padding: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Suscripciones al Plan
                </Typography>
                {data.planSubscriptions.length === 0 ? (
                  <Typography>No tienes suscripciones a planes actualmente.</Typography>
                ) : (
                  data.planSubscriptions.map((sub) => (
                    <Box key={sub.id} sx={{ mb: 2 }}>
                      <Typography variant="subtitle1">
                        Plan: {sub.plan?.name}
                      </Typography>
                      <Typography>
                        Precio: ${sub.plan?.price}
                      </Typography>
                      <Typography>
                        Inicio: {sub.startDate}
                      </Typography>
                      <Typography>
                        Fin: {sub.endDate}
                      </Typography>
                      {/* Aplica el estilo condicional */}
                      <Typography sx={{ color: sub.active ? 'green' : 'red' }}>
                        {sub.active ? 'Vigente' : 'Terminado'}
                      </Typography>
                    </Box>
                  ))
                )}
              </Paper>
            </Grid>

            {/* Suscripciones al Entrenador */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ padding: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Suscripciones al Entrenador
                </Typography>
                {data.trainerSubscriptions.length === 0 ? (
                  <Typography>No tienes suscripciones a entrenadores actualmente.</Typography>
                ) : (
                  data.trainerSubscriptions.map((tsub) => (
                    <Box key={tsub.id} sx={{ mb: 2 }}>
                      <Typography variant="subtitle1">
                        Entrenador: {tsub.personalTrainer.user.username}
                      </Typography>
                      <Typography>
                        Especialidad: {tsub.personalTrainer.specialization}
                      </Typography>
                      <Typography>
                        Mensualidad: ${tsub.personalTrainer.monthlyFee}
                      </Typography>
                      <Typography>
                        Inicio: {tsub.startDate}
                      </Typography>
                      <Typography>
                        Fin: {tsub.endDate}
                      </Typography>
                      <Typography sx={{ color: tsub.active ? 'green' : 'red' }}>
                        {tsub.active ? 'Vigente' : 'Terminado'}
                      </Typography>
                    </Box>
                  ))
                )}
              </Paper>
            </Grid>

            {/* Pagos de Plan */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ padding: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Pagos de Plan
                </Typography>
                {planPayments.length === 0 ? (
                  <Typography>No tienes pagos de plan registrados actualmente.</Typography>
                ) : (
                  planPayments.map((pay) => (
                    <Box key={pay.id} sx={{ mb: 2 }}>
                      <Typography>Plan: {pay.planName}</Typography>
                      <Typography>Método de pago: {pay.paymentMethod}</Typography>
                      <Typography>Monto: ${pay.transactionAmount}</Typography>
                      <Typography>
                        Fecha de pago: {new Date(pay.paymentDate!).toLocaleString()}
                      </Typography>
                    </Box>
                  ))
                )}
              </Paper>
            </Grid>
          </Grid>

          {/* Tabla de Productos */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Productos Adquiridos
            </Typography>
            {productPayments.length === 0 ? (
              <Typography>No tienes productos adquiridos actualmente.</Typography>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nombre</TableCell>
                      <TableCell>Precio</TableCell>
                      <TableCell>Marca</TableCell>
                      <TableCell>Método de Pago</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productPayments.flatMap((pay) =>
                      pay.products?.map((prod, idx) => (
                        <TableRow key={`${pay.id}-${idx}`}>
                          <TableCell>{prod.name}</TableCell>
                          <TableCell>${prod.price}</TableCell>
                          <TableCell>{prod.brand}</TableCell>
                          <TableCell>{prod.paymentMethod}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};
