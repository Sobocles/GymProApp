// src/Users/pages/AvailableClassesPage.tsx

import React from 'react';
import { useAvailableClasses } from '../../Users/hooks/useAvailableClasses';
import { CircularProgress, Typography, Container, Box, Button, List, ListItem, ListItemText } from '@mui/material';
import { format } from 'date-fns';

export const AvailableClassesPage: React.FC = () => {
  const { classes, loading, error, bookClassById } = useAvailableClasses();

  const handleBook = (classId: number) => {
    bookClassById(classId);
  };

  if (loading) return (
    <Container>
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    </Container>
  );

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Clases Grupales Disponibles
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      {classes.length === 0 && <Typography>No hay clases disponibles en este momento.</Typography>}

      <List>
  {classes.map((gc) => (
    <ListItem key={gc.id} sx={{ display: 'block', borderBottom: '1px solid #ccc', mb: 2 }}>
      <ListItemText
        primary={gc.className}
        secondary={
          <>
            <Typography>Inicio: {format(new Date(gc.startTime), 'dd/MM/yyyy HH:mm')}</Typography>
            <Typography>Fin: {format(new Date(gc.endTime), 'dd/MM/yyyy HH:mm')}</Typography>
            <Typography>Cupo Máx: {gc.maxParticipants}</Typography>
            <Typography>
              Cupos Disponibles: 
              <span style={{ color: gc.availableSlots === 0 ? 'red' : 'inherit' }}>
                {gc.availableSlots}
              </span>
            </Typography>
            {gc.assignedTrainer && (
              <Typography>Entrenador: {gc.assignedTrainer.user.username} ({gc.assignedTrainer.user.email})</Typography>
            )}
          </>
        }
      />
      <Button
        variant="contained"
        color={gc.availableSlots > 0 ? 'primary' : 'secondary'}
        onClick={() => handleBook(gc.id)}
        disabled={gc.availableSlots === 0}
      >
        {gc.availableSlots > 0 ? 'Reservar' : 'Sin cupo'}
      </Button>
    </ListItem>
  ))}
</List>

    </Container>
  );
};
