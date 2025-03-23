import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CardActions,
  Backdrop,
  CircularProgress
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useNavigate, useLocation } from 'react-router-dom';
import apiClient from '../../Apis/apiConfig';
import { Plan } from '../../Store/interface/Plan.ts';
import PesasCadaDia from '../../assets/Pesas-cada-dia.jpg';


const ServicePage = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // NUEVO: estado para mostrar el spinner al solicitar pago
  const [paymentLoading, setPaymentLoading] = useState<boolean>(false);

  const { isAuth, token } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await apiClient.get('/plans');
        setPlans(response.data);
      } catch (error) {
        console.error('Error fetching plans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSubscribe = async (planId: number) => {
    if (!isAuth) {
      alert('Por favor, inicia sesión para continuar.');
      navigate('/auth/login', { state: { from: location.pathname } });
      return;
    }

    // Activa el spinner
    setPaymentLoading(true);

    try {
      if (!token) {
        alert('Token no encontrado. Por favor, inicia sesión nuevamente.');
        navigate('/auth/login', { state: { from: location.pathname } });
        setPaymentLoading(false); // Apagar spinner
        return;
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      const response = await apiClient.post(`/payment/create_plan_preference?planId=${planId}`, {}, config);
      
      const preference = response.data;
      window.location.href = preference.initPoint;  // Redirección MercadoPago
    } catch (error) {
      console.error('Error al crear la preferencia de pago:', error);
      alert('Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente.');
      setPaymentLoading(false); // Apagar spinner si ocurre error
    }
  };

  const handlePlanPlusTrainer = (planId: number) => {
    if (!isAuth) {
      alert('Por favor, inicia sesión para continuar.');
      navigate('/auth/login', { state: { from: location.pathname } });
      return;
    }

    // Aquí NO llamas al backend directamente, solo navegas.
    // Entonces NO necesitas spinner. O si quieres, lo puedes poner.
    navigate(`/personal-trainer?planId=${planId}`);
  };

  const handleOnlyTrainer = () => {
    if (!isAuth) {
      alert('Por favor, inicia sesión para continuar.');
      navigate('/auth/login', { state: { from: location.pathname } });
      return;
    }
    navigate(`/personal-trainer?onlyTrainer=true`);
  };

  if (loading) {
    return <Typography>Cargando planes...</Typography>;
  }

  return (
    <Box sx={{ 
      padding: 6,
      minHeight: '100vh',
      backgroundColor: 'white',
      color: '#2a2a2a'
    }}>
      <Backdrop open={paymentLoading} sx={{ 
        zIndex: 9999,
        backgroundColor: 'rgba(255, 255, 255, 0.9)'
      }}>
        <CircularProgress size={80} color="primary" />
      </Backdrop>

      <Typography variant="h3" align="center" gutterBottom sx={{
        fontWeight: 'bold',
        mb: 8,
        textTransform: 'uppercase',
        color: '#1976d2',
        letterSpacing: 4,
        position: 'relative',
        '&::after': {
          content: '""',
          display: 'block',
          width: '60px',
          height: '4px',
          backgroundColor: '#1976d2',
          margin: '20px auto 0'
        }
      }}>
        Transforma tu Cuerpo
      </Typography>

      <Grid container spacing={6} justifyContent="center">
        {plans.map((plan) => (
          <Grid item xs={12} sm={6} md={4} key={plan.id}>
            <Card sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              height: '100%',
              borderRadius: 4,
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-10px)',
                boxShadow: '0 10px 20px rgba(25, 118, 210, 0.2)'
              },
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              position: 'relative'
            }}>
              <CardMedia
                component="img"
                height="220"
                image={PesasCadaDia}
                alt="Pesas cada día"
                sx={{
                  objectFit: 'cover',
                  position: 'relative'
                }}
              />

              <CardContent sx={{ 
                flexGrow: 1,
                position: 'relative',
                zIndex: 2
              }}>
                <Typography variant="h4" component="div" sx={{
                  fontWeight: 'bold',
                  mb: 2,
                  color: '#1976d2',
                  textTransform: 'uppercase'
                }}>
                  {plan.name}
                </Typography>
                
                <Typography variant="body1" sx={{ 
                  color: '#666666',
                  minHeight: 80,
                  mb: 3
                }}>
                  {plan.description || 'Descripción del plan'}
                </Typography>

                {plan.discount ? (
                  <Box sx={{ 
                    background: 'rgba(255, 50, 50, 0.1)',
                    p: 2,
                    borderRadius: 2,
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid #ff4444'
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="h6" sx={{ 
                          textDecoration: 'line-through',
                          color: '#ff4444'
                        }}>
                          ${plan.price}
                        </Typography>
                        <Typography variant="h4" sx={{
                          color: '#1976d2',
                          fontWeight: 'bold',
                          lineHeight: 1
                        }}>
                          ${plan.price - plan.price * (plan.discount / 100)}
                        </Typography>
                      </Box>
                      <Box sx={{
                        background: '#ff4444',
                        color: 'white',
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        textAlign: 'center'
                      }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          -{plan.discount}%
                        </Typography>
                        <Typography variant="caption">
                          {plan.discountReason}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ) : (
                  <Typography variant="h4" sx={{ 
                    fontWeight: 'bold',
                    color: '#1976d2',
                    textAlign: 'center'
                  }}>
                    ${plan.price}
                  </Typography>
                )}
              </CardContent>

              <CardActions sx={{
                flexDirection: 'column',
                gap: 2,
                p: 3,
                position: 'relative',
                zIndex: 2
              }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => handleSubscribe(plan.id)}
                  sx={{
                    background: 'linear-gradient(45deg, #1976d2 0%, #1565c0 100%)',
                    color: 'white',
                    fontWeight: 'bold',
                    py: 1.5,
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: '0 5px 15px rgba(25, 118, 210, 0.4)'
                    },
                    transition: 'transform 0.3s, box-shadow 0.3s'
                  }}
                >
                  Comprar Plan
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => handlePlanPlusTrainer(plan.id)}
                  sx={{
                    borderColor: '#1976d2',
                    color: '#1976d2',
                    fontWeight: 'bold',
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.1)',
                      borderWidth: 2
                    }
                  }}
                >
                  + Personal Trainer
                </Button>

                <Typography variant="caption" sx={{
                  color: '#666666',
                  textAlign: 'center',
                  mt: 1
                }}>
                  *Tarifa variable según entrenador
                </Typography>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ 
        marginTop: 8,
        textAlign: 'center',
        borderTop: '2px solid #e0e0e0',
        pt: 6
      }}>
        <Typography variant="h4" sx={{ 
          mb: 4,
          fontWeight: 'bold',
          color: '#1976d2'
        }}>
          ¿Solo necesitas un entrenador?
        </Typography>
        <Button
          variant="contained"
          onClick={handleOnlyTrainer}
          sx={{
            background: 'linear-gradient(45deg, #1976d2 0%, #1565c0 100%)',
            color: 'white',
            fontWeight: 'bold',
            px: 6,
            py: 2,
            fontSize: '1.1rem',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: '0 5px 20px rgba(25, 118, 210, 0.4)'
            },
            transition: 'transform 0.3s, box-shadow 0.3s'
          }}
        >
          Contratar Entrenador Personal
        </Button>
      </Box>
    </Box>
  );
};

export default ServicePage;