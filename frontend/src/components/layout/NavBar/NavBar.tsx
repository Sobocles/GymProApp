import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../../../Auth/hooks/useAuth';

const Navbar: React.FC = () => {
  const { login, handlerLogout } = useAuth();

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        {/* Botón para abrir el menú lateral en dispositivos móviles (opcional) */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          GymApp
        </Typography>
        
        {login.isAuth && login.user && (
          <Typography variant="body1" sx={{ marginRight: 2 }}>
            {`Hola, ${login.user.username}`}
          </Typography>
        )}

        {login.isAuth && (
          <Button color="inherit" onClick={handlerLogout}>
            Cerrar Sesión
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
