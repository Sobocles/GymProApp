// src/components/layout/Header/Header.tsx
import React, { useState, useEffect, MouseEvent } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  IconButton,
  Badge,
  ButtonProps,
} from '@mui/material';
import { styled } from '@mui/system';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useAuth } from '../../../Auth/hooks/useAuth';

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { getAllCategories, Category } from '../../../Store/services/CategoryService';

interface NavButtonProps extends ButtonProps {
  to?: string;
  component?: React.ElementType;
}

const NavButton = styled(Button)<NavButtonProps>(
  ({ theme }) => ({
    color: '#ffffff',
    margin: theme.spacing(1),
    transition: 'transform 0.3s, backgroundColor 0.3s',
    fontSize: '1rem',
    '&:hover': {
      backgroundColor: '#f50057',
      transform: 'scale(1.1)',
    },
  })
);



// Menú público: solo "Inicio" y "Servicios"
const publicNavItems = [
  { label: 'Inicio', path: '/' },
  { label: 'Servicios', path: '/services' },
];

function getDashboardPath(roles: string[]): string {
  if (roles.includes('ROLE_ADMIN')) return '/admin/dashboard';
  if (roles.includes('ROLE_TRAINER')) return '/trainers/dashboard';
  return '/dashboard';
}

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { login, handlerLogout } = useAuth();

  const userRoles = login.user?.roles || [];


  // Carrito
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Categorías para el menú "Tienda"
  const [categories, setCategories] = useState<Category[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorElCart, setAnchorElCart] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const c = await getAllCategories();
        setCategories(c);
      } catch (error) {
        console.error('Error al cargar categorías', error);
      }
    };
    loadCategories();
  }, []);

  // Funciones para el menú de tienda
  const handleStoreMenuOpen = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleStoreMenuClose = () => {
    setAnchorEl(null);
  };

  // Funciones para el menú del carrito
  const handleCartClick = (e: MouseEvent<HTMLElement>) => {
    setAnchorElCart(e.currentTarget);
  };
  const handleCartClose = () => {
    setAnchorElCart(null);
  };

  // Navegación
  const handleNavigate = (path: string) => {
    navigate(path);
    handleStoreMenuClose();
  };

  const goToDashboard = () => {
    const dashPath = getDashboardPath(userRoles);
    navigate(dashPath);
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        {/* Logo */}
        <FitnessCenterIcon sx={{ display: { xs: 'none', sm: 'block' }, mr: 1 }} />
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            textDecoration: 'none',
            color: '#ffffff',
            flexGrow: 1,
            display: { xs: 'none', sm: 'block' },
            fontWeight: 'bold',
          }}
        >
          GymPro
        </Typography>

        {/* Menú principal (botones) alineados a la izquierda */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', flexGrow: 1, ml: 10 }}>
          {publicNavItems.map((item) => (
            <NavButton
  key={item.label}
  component={RouterLink}
  to={item.path}
>
  {item.label}
</NavButton>

          ))}
          {/* Botón de "Tienda" con menú desplegable */}
          <NavButton onClick={handleStoreMenuOpen}>Tienda</NavButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleStoreMenuClose}
          >
            <MenuItem onClick={() => handleNavigate('/store')}>
              Ver Todos
            </MenuItem>
            {categories.map((cat) => (
              <MenuItem
                key={cat.id}
                onClick={() => handleNavigate(`/store?category=${cat.name}`)}
              >
                {cat.name}
              </MenuItem>
            ))}
          </Menu>
        </Box>

        {/* Icono del carrito */}
        <IconButton sx={{ color: '#ffffff' }} onClick={handleCartClick}>
          <Badge badgeContent={totalItems} color="error">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
        <Menu
          anchorEl={anchorElCart}
          open={Boolean(anchorElCart)}
          onClose={handleCartClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Box sx={{ p: 2, minWidth: 300 }}>
            {cartItems.length === 0 ? (
              <Typography>No hay productos en el carrito</Typography>
            ) : (
              <>
                {cartItems.map((item) => (
                  <Box
                    key={item.product.id}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Box display="flex" alignItems="center">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        style={{
                          width: 60,
                          height: 60,
                          objectFit: 'cover',
                          marginRight: 12,
                          borderRadius: 8
                        }}
                      />
                      <Box>
                        <Typography variant="body2">{item.product.name}</Typography>
                        <Typography variant="body2">
                          Cantidad: {item.quantity}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" sx={{ ml: 2 }}>
                      ${item.product.price * item.quantity}
                    </Typography>
                  </Box>
                ))}
                <Box mt={2}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => {
                      handleCartClose();
                      navigate('/cart');
                    }}
                  >
                    Ver Carrito
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Menu>

        {/* Bloque de autenticación */}
        {login.isAuth ? (
          <>
            <IconButton sx={{ color: '#ffffff', ml: 1 }} onClick={goToDashboard}>
              <DashboardIcon />
            </IconButton>
            <Typography sx={{ ml: 2, mr: 2 }}>
              Hola, {login.user?.username}
            </Typography>
            <Button color="inherit" onClick={handlerLogout}>
              Cerrar Sesión
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={RouterLink} to="/auth/login">
              Iniciar Sesión
            </Button>
            <Button color="inherit" component={RouterLink} to="/auth/register">
              Registrarse
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
