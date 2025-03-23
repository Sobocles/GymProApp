// src/components/LoadingSpinner.tsx
import { Box, CircularProgress, Typography } from '@mui/material';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const pulse = keyframes`
  0% { transform: scale(0.95); opacity: 0.6; }
  50% { transform: scale(1); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.6; }
`;

const AnimatedBox = styled(Box)`
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const LoadingSpinner = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{
        background: 'linear-gradient(45deg, #f3f4f6 30%, #e5e7eb 90%)',
      }}
    >
      <AnimatedBox>
        <CircularProgress 
          size={80}
          thickness={4}
          sx={{
            color: (theme) => theme.palette.primary.main,
            marginBottom: 2,
          }}
        />
      </AnimatedBox>
      <Typography 
        variant="h6" 
        color="textSecondary"
        sx={{
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 500,
          letterSpacing: '0.05em',
        }}
      >
        Cargando contenido...
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;