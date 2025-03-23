
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Button,
  Backdrop,
  CircularProgress,
  Chip
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useNavigate, useLocation } from 'react-router-dom';
import apiClient from '../../Apis/apiConfig';
import InstagramIcon from '@mui/icons-material/Instagram'; 
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Plan } from '../../Store/interface/Plan'
import { Trainer } from '../../Store/interface/Trainer';

// Interfaces

/*
interface Plan {
  id: number;
  name: string;
  description?: string;
  price: number;          // Este ya es el PRECIO TOTAL del período (ej: 150000 anual)
  discount?: number;      // Porcentaje de descuento
  discountReason?: string;
  durationMonths?: number; // Cantidad de meses, ej: 12
} */

const PersonalTrainerPage = () => {
  // Entrenadores
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Para mostrar spinner al crear preferencia de pago
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Plan seleccionado
  const [plan, setPlan] = useState<Plan | null>(null);

  // Leer parámetros de URL
  const [searchParams] = useSearchParams();
  const planId = searchParams.get('planId');
  const onlyTrainer = searchParams.get('onlyTrainer') === 'true';

  // Auth y navegación
  const { isAuth, token } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

 

  // 1. Cargar entrenadores y, si corresponde, cargar el plan
  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await apiClient.get('/trainer-schedule/all-available');
        console.log("entrenadores disponibles response",response);
    
        setTrainers(response.data);
      } catch (error) {
        console.error('Error fetching trainers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainers();

    // Si no es "onlyTrainer" y sí hay un planId, traer el plan
    if (!onlyTrainer && planId) {
      const response = apiClient
        .get(`/plans/${planId}`)
        .then((res) => {
          console.log("response",response);
          setPlan(res.data);
        })
        .catch((err) => {
          console.error('Error fetching plan:', err);
        });
    }
  }, [planId, onlyTrainer]);

  // 2. Calcular precio total del plan (ya es el costo de TODO el período).
  //    Sólo aplicamos descuento si existe:
  const getPlanPriceFinal = () => {
    if (!plan) return 0;
    let finalPrice = plan.price; // precio TOTAL
    if (plan.discount && plan.discount > 0) {
      finalPrice = finalPrice - (finalPrice * (plan.discount / 100));
    }
    return finalPrice;
  };

  // 3. Al hacer clic en "Contratar Entrenador" o "Contratar Plan + Entrenador"
  const handleHireTrainer = async (trainerId: number) => {
    if (!isAuth) {
      alert('Por favor, inicia sesión para continuar.');
      // Guardar la ruta actual para redirigir tras login
      navigate('/auth/login', { state: { from: location.pathname } });
      return;
    }

    if (!token) {
      alert('Token no encontrado. Por favor, inicia sesión nuevamente.');
      navigate('/auth/login', { state: { from: location.pathname } });
      return;
    }

    // Construimos URL del endpoint
    let url = '/payment/create_plan_preference';
    if (onlyTrainer) {
      url += `?trainerId=${trainerId}&onlyTrainer=true`;
      console.log("url",url);
    } else {
      if (!planId) {
        alert('No se encontró el plan. Por favor, regresa y selecciona un plan.');
        navigate('/services');
        return;
      }
      url += `?planId=${planId}&trainerId=${trainerId}`;
      console.log("url",url);
    }

    setPaymentLoading(true); // Mostrar spinner
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      const response = await apiClient.post(url, {}, config);
      console.log("response",response);
      const preference = response.data;

      // Redirigir a la URL de Mercado Pago
      window.location.href = preference.initPoint;
    } catch (error) {
      setPaymentLoading(false); // Ocultar spinner si hay error
      console.error('Error al crear la preferencia de pago:', error);
      alert('Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente.');
    }
  };

  // 4. Mientras cargamos entrenadores, mostramos un mensaje
  if (loading) {
    return <Typography>Cargando entrenadores...</Typography>;
  }

  // 5. Obtener el precio final del plan (ya con descuento)
  const planPriceFinal = getPlanPriceFinal();

  return (
    <Box sx={{
      p: 4,
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh'
    }}>
      <Backdrop open={paymentLoading} sx={{ color: '#fff', zIndex: 9999 }}>
        <CircularProgress color="inherit" size={80} thickness={4} />
      </Backdrop>

      <Typography variant="h3" gutterBottom align="center" sx={{
        fontFamily: 'Poppins, sans-serif',
        fontWeight: 700,
        color: '#2d3436',
        mb: 6,
        textTransform: 'uppercase',
        letterSpacing: 2
      }}>
        Elige tu Entrenador
      </Typography>

      {/* Sección de precio */}
      {!onlyTrainer && plan && (
        <Box sx={{
          textAlign: 'center',
          mb: 6,
          p: 3,
          borderRadius: 3,
          background: 'rgba(255,255,255,0.9)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          maxWidth: 400,
          mx: 'auto'
        }}>
          {/* ... (contenido del precio se mantiene igual) */}
        </Box>
      )}


      <Grid container spacing={4}>
        {trainers.map((trainer) => {
          // Tarifa mensual del entrenador
          const monthlyFee = trainer.monthlyFee || 0;


          const trainerPrice = onlyTrainer
            ? monthlyFee
            : monthlyFee * (plan?.durationMonths ?? 1);

          // Plan + Entrenador
          const total = plan ? planPriceFinal + trainerPrice : trainerPrice;

          return (
            <Grid item xs={12} sm={6} md={4} key={trainer.id}>
              <Card sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                borderRadius: 4,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.15)'
                },
                background: 'rgba(255,255,255,0.95)'
              }}>
                <CardMedia
                  component="img"
                  height="280"
                  image={`${trainer.profileImageUrl}?v=${trainer.id}`}
                  alt={trainer.username}
                  sx={{
                    objectFit: 'cover',
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16
                  }}
                />
                
                <CardContent sx={{ flexGrow: 1, px: 3, pt: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" sx={{
                      fontFamily: 'Poppins',
                      fontWeight: 600,
                      color: '#2d3436',
                      flexGrow: 1
                    }}>
                      {trainer.username}
                    </Typography>
                    {trainer.title && (
                      <Chip
                        label={trainer.title}
                        size="small"
                        sx={{
                          bgcolor: '#0984e3',
                          color: 'white',
                          fontSize: '0.7rem',
                          height: 24
                        }}
                      />
                    )}
                  </Box>

                  <Typography variant="body2" sx={{
                    color: '#636e72',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    '& strong': { color: '#2d3436', mr: 1 }
                  }}>
                    🏋️♂️ <strong>Especialidad:</strong> {trainer.specialization}
                  </Typography>

                  {/* Redes Sociales */}
                  <Box sx={{ mb: 2 }}>
                    {trainer.instagramUrl && (
                      <Button
                        variant="outlined"
                        startIcon={<InstagramIcon />}
                        href={trainer.instagramUrl}
                        target="_blank"
                        sx={{
                          mr: 1,
                          color: '#e1306c',
                          borderColor: '#e1306c',
                          '&:hover': { bgcolor: '#fce4ec' }
                        }}
                      >
                        Instagram
                      </Button>
                    )}
                    
                    {trainer.whatsappNumber && (
                      <Button
                        variant="outlined"
                        startIcon={<WhatsAppIcon />}
                        href={`https://wa.me/${trainer.whatsappNumber}`}
                        target="_blank"
                        sx={{
                          color: '#25D366',
                          borderColor: '#25D366',
                          '&:hover': { bgcolor: '#e2f7eb' }
                        }}
                      >
                        WhatsApp
                      </Button>
                    )}
                  </Box>

                  {/* Certificación */}
                  {trainer.certificationFileUrl && (
                    <Button
                      variant="text"
                      size="small"
                      href={trainer.certificationFileUrl}
                      target="_blank"
                      sx={{
                        color: '#0984e3',
                        textTransform: 'none',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      📄 Ver Certificación
                    </Button>
                  )}

                  {/* Precios */}
                  <Box sx={{
                    mt: 3,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: '#f8f9fa'
                  }}>
                    {onlyTrainer ? (
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        💸 Tarifa Mensual: 
                        <span style={{ color: '#00b894', marginLeft: 8 }}>
                          ${monthlyFee.toFixed(2)}
                        </span>
                      </Typography>
                    ) : (
                      <>
                        <Typography variant="body2" sx={{ color: '#636e72' }}>
                          Plan: <span style={{ color: '#00b894' }}>${planPriceFinal.toFixed(2)}</span>
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#636e72', mb: 1 }}>
                          + Entrenador: <span style={{ color: '#00b894' }}>${trainerPrice.toFixed(2)}</span>
                        </Typography>
                        <Typography variant="h6" sx={{ 
                          color: '#2d3436',
                          fontWeight: 700,
                          textAlign: 'center'
                        }}>
                          🚀 Total: ${total.toFixed(2)}
                        </Typography>
                      </>
                    )}
                  </Box>
                </CardContent>

                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleHireTrainer(trainer.id)}
                    sx={{
                      bgcolor: '#00b894',
                      color: 'white',
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                      '&:hover': {
                        bgcolor: '#00cec9',
                        transform: 'scale(1.02)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {onlyTrainer ? 'Contratar Ahora' : 'Seleccionar Paquete'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default PersonalTrainerPage;
