import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate} from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Grid,
  Divider,
  Chip,
  Stack,
  Skeleton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { getProductById, createProductPreference } from '../../Store/services/ProductService';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../Store/Store/slices/cartSlice';
import { RootState } from '../../store';
import Swal from 'sweetalert2';
import { Product } from '../interface/Product';

function getDiscountedPrice(product: Product) {
  const now = new Date();
  
  const start = product.discountStart ? new Date(product.discountStart) : null;
  const end = product.discountEnd ? new Date(product.discountEnd) : null;

  let isDiscountActive = false;
  if (
    product.discountPercent &&
    product.discountPercent > 0 &&
    start && end &&
    now >= start &&
    now <= end
  ) {
    isDiscountActive = true;
  }

  const originalPrice = product.price;
  let finalPrice = product.price;
  
  if (isDiscountActive) {
    finalPrice = finalPrice - (finalPrice * product.discountPercent / 100);
  }

  return {
    originalPrice,
    finalPrice,
    isDiscountActive,
    discountReason: isDiscountActive ? product.discountReason : null
  };
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [product, setProduct] = useState<Product | null>(null);
  const { items: cartItems } = useSelector((state: RootState) => state.cart);
  const { isAuth } = useSelector((state: RootState) => state.auth);

  // Se busca si ya existe este producto en el carrito
  const cartItem = cartItems.find(item => item.product.id === Number(id));
  const quantityInCart = cartItem ? cartItem.quantity : 0;
  
  // Estado local para la cantidad a agregar desde el detalle
  const [quantity, setQuantity] = useState(1); 

  useEffect(() => {
    const fetchProduct = async () => {
      const productId = parseInt(id || '', 10);
      if (isNaN(productId)) {
        console.error('ID del producto no válido:', id);
        return;
      }
      try {
        const productData = await getProductById(productId);
        setProduct(productData);
      } catch (error) {
        console.error('Error al obtener el producto:', error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleIncrease = () => {
    setQuantity(prev => prev + 1);
  };
  
  const handleDecrease = () => {
    setQuantity(prev => Math.max(1, prev - 1)); // No permitir menos de 1
  };

  const handleAddToCart = () => {
    if (product) {
      // Calculamos el stock disponible: stock total del producto - cantidad ya en el carrito
      const availableStock = product.stock - quantityInCart;
      
      // Validamos que el stock disponible sea suficiente para la cantidad que se quiere agregar
      if (availableStock >= quantity) {
        dispatch(addToCart({ product, quantity })); // Agrega la cantidad seleccionada
        Swal.fire({
          title: '¡Agregado!',
          text: `Has agregado ${quantity} unidad${quantity > 1 ? 'es' : ''} de "${product.name}" al carrito.`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          title: 'Sin stock',
          text: 'Lo sentimos, no hay suficientes unidades disponibles para agregar.',
          icon: 'error',
        });
      }
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;

    if (!isAuth) {
      await Swal.fire({
        title: 'Acceso requerido',
        text: 'Debes iniciar sesión para realizar una compra. Serás redirigido al login.',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
      navigate('/auth/login', { state: { from: location.pathname } });
      return;
    }

    const { finalPrice } = getDiscountedPrice(product);
    const payload = [{
      productId: product.id,
      unitPrice: finalPrice,
      quantity: quantity, // Usar cantidad local
    }];

    try {
      const response = await createProductPreference(payload);
      if (response.initPoint) {
        window.location.href = response.initPoint;
      }
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      alert('Error al procesar el pago.');
    }
  };

  if (!product) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="rectangular" width="100%" height={400} />
        <Box sx={{ mt: 2 }}>
          <Skeleton width="60%" height={40} />
          <Skeleton width="40%" height={30} />
          <Skeleton width="30%" height={30} />
        </Box>
      </Box>
    );
  }

  // Obtenemos datos del descuento
  const { originalPrice, finalPrice, isDiscountActive, discountReason } = getDiscountedPrice(product);
  // Calculamos el stock disponible en detalle (stock total - cantidad en carrito)
  const availableStock = product.stock - quantityInCart;

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box sx={{
            position: 'relative',
            borderRadius: 2,
            overflow: 'hidden',
            bgcolor: 'background.paper',
            boxShadow: 2,
            padding: 2
          }}>
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.name}
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                  maxHeight: '500px'
                }}
              />
            )}
            {isDiscountActive && (
              <Chip
                label="¡Oferta!"
                color="error"
                icon={<LocalOfferIcon />}
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  fontSize: '1rem',
                  padding: 1
                }}
              />
            )}
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              color: theme.palette.text.primary
            }}
          >
            {product.name}
          </Typography>

          <Typography 
            variant="body1" 
            paragraph
            sx={{
              fontSize: '1.1rem',
              lineHeight: 1.6,
              color: theme.palette.text.secondary,
              mb: 4
            }}
          >
            {product.description || 'Sin descripción disponible.'}
          </Typography>

          {/* Mostrar precio y, a continuación, stock restante */}
          <Box sx={{ mb: 4 }}>
            {isDiscountActive ? (
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography
                  variant="h4"
                  sx={{
                    color: theme.palette.error.main,
                    fontWeight: 700
                  }}
                >
                  ${finalPrice.toFixed(2)} c/u
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    textDecoration: 'line-through',
                    color: theme.palette.text.disabled
                  }}
                >
                  ${originalPrice.toFixed(2)}
                </Typography>
              </Stack>
            ) : (
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary
                }}
              >
                ${originalPrice.toFixed(2)} c/u
              </Typography>
            )}
            
            {/* Mostrar stock disponible en detalle */}
            <Typography variant="body2" sx={{ mt: 1 }}>
              Stock disponible: {availableStock} {availableStock === 1 ? 'unidad' : 'unidades'}
            </Typography>

            {/* Mostrar el total basado en la cantidad en el carrito (si fuera necesario) */}
            <Typography variant="h6" sx={{ mt: 2 }}>
              Total: ${(finalPrice * quantityInCart).toFixed(2)}
            </Typography>

            {discountReason && (
              <Chip
                label={discountReason}
                color="info"
                size="small"
                sx={{ mt: 1, fontSize: '0.9rem' }}
              />
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Cantidad:
            </Typography>
            <Stack direction="row" alignItems="center" spacing={2}>
              <IconButton 
                onClick={handleDecrease} 
                color="primary"
                sx={{
                  border: `1px solid ${theme.palette.primary.main}`,
                  borderRadius: '8px'
                }}
              >
                <RemoveIcon />
              </IconButton>
              <Typography 
                variant="h6" 
                sx={{ 
                  minWidth: '40px', 
                  textAlign: 'center',
                  fontWeight: 600
                }}
              >
                {quantity} 
              </Typography>
              <IconButton 
                onClick={handleIncrease} 
                color="primary"
                sx={{
                  border: `1px solid ${theme.palette.primary.main}`,
                  borderRadius: '8px'
                }}
              >
                <AddIcon />
              </IconButton>
            </Stack>
          </Box>

          <Stack 
            direction={isMobile ? "column" : "row"} 
            spacing={2} 
            sx={{ mt: 4 }}
          >
          <Button
            variant="contained"
            color="primary"
            onClick={handleBuyNow}
            disabled={availableStock <= 0} // Se deshabilita si no hay stock
            size="large"
            fullWidth
            sx={{
              py: 1.5,
              fontSize: '1.1rem',
              textTransform: 'none'
            }}
          >
            Comprar ahora ({quantity} unidades)
          </Button>

            
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleAddToCart}
              size="large"
              fullWidth
              sx={{
                py: 1.5,
                fontSize: '1.1rem',
                textTransform: 'none'
              }}
            >
              Añadir al carrito
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductDetailPage;
