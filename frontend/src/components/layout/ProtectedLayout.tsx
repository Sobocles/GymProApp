// src/components/layout/ProtectedLayout.tsx
import { Outlet } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import Navbar from '../../components/layout/NavBar/NavBar';
import Sidebar from '../../components/layout/SideBar/SideBar';


const ProtectedLayout = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      
      <Navbar />

      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default ProtectedLayout;
