import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { RootState } from '../../store';
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  CartItem
} from '../Store/slices/cartSlice';
import { Box, Typography, IconButton, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { createProductPreference } from '../services/ProductService';
import Swal from 'sweetalert2';

/**
 * Función auxiliar para calcular el precio con descuento.
 */
function getDiscountedPrice(item: CartItem) {
  const { product } = item;
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

const CartPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { items } = useSelector((state: RootState) => state.cart);
  const { isAuth } = useSelector((state: RootState) => state.auth);

  if (items.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h5">Tu carrito está vacío</Typography>
      </Box>
    );
  }

  // Calcular el total del carrito
  const totalPrice = items.reduce((acc, item) => {
    const { finalPrice } = getDiscountedPrice(item);
    return acc + finalPrice * item.quantity;
  }, 0);

  const handleCheckout = async () => {
    if (!isAuth) {
      navigate('/auth/login', { state: { from: location.pathname } });
      return;
    }
    
    const payload = items.map(item => {
      const { finalPrice } = getDiscountedPrice(item);
      return {
        productId: item.product.id,
        unitPrice: finalPrice,
        quantity: item.quantity,
      };
    });

    try {
      const response = await createProductPreference(payload);
      const { initPoint } = response;
      if (initPoint) {
        window.location.href = initPoint;
      }
    } catch (error) {
      console.error('Error al procesar el checkout:', error);
      alert('Error durante el proceso de compra.');
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Carrito de Compras
      </Typography>

      {items.map(item => {
        const { originalPrice, finalPrice, isDiscountActive, discountReason } = getDiscountedPrice(item);
        // Calculamos el stock disponible para este ítem
        const availableStock = item.product.stock - item.quantity;

        return (
          <Box
            key={item.product.id}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{ borderBottom: '1px solid #ccc', py: 1 }}
          >
            <Box display="flex" alignItems="center">
              <img
                src={item.product.imageUrl}
                alt={item.product.name}
                style={{
                  width: '80px',
                  height: '80px',
                  objectFit: 'cover',
                  marginRight: '16px',
                  borderRadius: '8px',
                }}
              />
              <Box>
                <Typography variant="h6">{item.product.name}</Typography>
                {/* Mostrar stock disponible */}
                <Typography variant="body2">
                  Stock disponible: {availableStock} {availableStock === 1 ? 'unidad' : 'unidades'}
                </Typography>
                
                {isDiscountActive ? (
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ textDecoration: 'line-through', color: 'gray' }}
                    >
                      ${originalPrice.toFixed(2)}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: 'red', fontWeight: 'bold' }}
                    >
                      ${finalPrice.toFixed(2)} (x {item.quantity})
                    </Typography>
                    {discountReason && (
                      <Typography
                        variant="body2"
                        sx={{ color: 'red', fontStyle: 'italic' }}
                      >
                        {discountReason}
                      </Typography>
                    )}
                  </Box>
                ) : (
                  <Typography variant="body2">
                    ${originalPrice.toFixed(2)} (x {item.quantity})
                  </Typography>
                )}
              </Box>
            </Box>

            <Box display="flex" alignItems="center">
              <IconButton
                color="primary"
                onClick={() => dispatch(decreaseQuantity(item.product.id!))}

              >
                <RemoveIcon />
              </IconButton>
              <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
              <IconButton
  color="primary"
  onClick={() => dispatch(decreaseQuantity(item.product.id!))}
>
  <RemoveIcon />
</IconButton>
<Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
<IconButton
  color="primary"
  onClick={() => {
    if (availableStock > 0) {
      dispatch(increaseQuantity(item.product.id!));
    } else {
      Swal.fire({
        title: 'Sin stock',
        text: 'No hay unidades disponibles para agregar.',
        icon: 'error'
      });
    }
  }}
  disabled={availableStock <= 0}
>
  <AddIcon />
</IconButton>
<IconButton
  color="error"
  onClick={() => dispatch(removeFromCart(item.product.id!))}
>
  <DeleteIcon />
</IconButton>

              <IconButton
                color="error"
                onClick={() => dispatch(removeFromCart(item.product.id!))}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        );
      })}

      <Box mt={2}>
        <Typography variant="h6">
          Total: ${totalPrice.toFixed(2)}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleCheckout}
        >
          Pagar Ahora
        </Button>
      </Box>
    </Box>
  );
};

export default CartPage;
