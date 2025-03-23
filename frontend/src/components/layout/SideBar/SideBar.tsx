// src/components/layout/SideBar/SideBar.tsx

import React, { useState } from 'react';
import { useAuth } from '../../../Auth/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import {
  Drawer,
  Toolbar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { menuItems } from '../../../config/menuItems';


// Ancho del drawer
const drawerWidth = 300;

const Sidebar: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  // Rol principal del usuario (admin, trainer o user)
  const userRoles = login.roles || [];
  // Si asumimos que userRoles siempre tendrá 1 rol, lo tomamos:
  const userRole = userRoles.length > 0 ? userRoles[0] : 'ROLE_USER';


  // Estado para controlar qué submenú está abierto
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const handleClickItem = (label: string) => {
    // Si el submenú que se clickeó ya está abierto, lo cerramos
    if (openSubmenu === label) {
      setOpenSubmenu(null);
    } else {
      // Si está cerrado (o hay otro abierto), abrimos este
      setOpenSubmenu(label);
    }
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          // Ejemplo de gradiente de fondo y color de texto blanco
          background: 'linear-gradient(45deg, #2196F3 30%, #F44336 90%)',
          color: '#fff',
        },
      }}
    >
      <Toolbar />
      <Divider />

      <List>
        {menuItems
          .filter((item) => item.roles.includes(userRole))
          .map((item) => {
            // Si el item tiene subItems, renderizamos un menú colapsable
            if (item.subItems && item.subItems.length > 0) {
              return (
                <React.Fragment key={item.label}>
                  <ListItemButton onClick={() => handleClickItem(item.label)}>
                    <ListItemIcon sx={{ color: '#fff' }}>
                      {React.createElement(item.icon)}
                    </ListItemIcon>
                    <ListItemText primary={item.label} />
                    {openSubmenu === item.label ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>

                  <Collapse in={openSubmenu === item.label} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.subItems.map((sub) => (
                        <ListItemButton
                          key={sub.label}
                          sx={{ pl: 8 }} // un poco de padding para sub-items
                          onClick={() => navigate(sub.path)}
                        >
                          <ListItemText primary={sub.label} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                </React.Fragment>
              );
            } 
            // Si el item NO tiene subItems, renderizamos un item simple
            else {
              return (
                <ListItemButton
                  key={item.label}
                  onClick={() => navigate(item.path)}
                >
                  <ListItemIcon sx={{ color: '#fff' }}>
                    {React.createElement(item.icon)}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              );
            }
          })}
      </List>
    </Drawer>
  );
};

export default Sidebar;
