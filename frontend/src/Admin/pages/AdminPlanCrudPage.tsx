/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import {
  Container,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Box
} from '@mui/material';
import apiClient from '../../Apis/apiConfig'; 

interface IPlan {
  id?: number;
  name: string;
  price: number;
  description?: string;
  discount?: number;
  discountReason?: string; 
  versionNumber?: number;
  active?: boolean;
  durationMonths?: number; 
}

const AdminPlanCrudPage: React.FC = () => {
  const [plans, setPlans] = useState<IPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados para controlar el modal
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

  // Estados de carga para operaciones específicas
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [archivingPlanId, setArchivingPlanId] = useState<number | null>(null);

  // Estado del form
  const [planData, setPlanData] = useState<IPlan>({
    name: '',
    price: 0,
    description: '',
    discount: 0,
    discountReason: '',
    durationMonths: 1 
  });

  const fetchPlans = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/plans'); 
      setPlans(response.data);
    } catch (err: any) {
      console.error('Error al obtener planes:', err);
      setError('No se pudo obtener la lista de planes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleOpenCreate = () => {
    setDialogMode('create');
    setPlanData({ name: '', price: 0, description: '', discount: 0, discountReason: '', durationMonths: 1 });
    setSelectedPlanId(null);
    setOpenDialog(true);
  };

  const handleOpenEdit = (plan: IPlan) => {
    setDialogMode('edit');
    setSelectedPlanId(plan.id || null);
    setPlanData({
      name: plan.name,
      price: plan.price,
      description: plan.description || '',
      discount: plan.discount || 0,
      discountReason: plan.discountReason || '',
      versionNumber: plan.versionNumber,
      active: plan.active,
      durationMonths: plan.durationMonths || 1
    });
    setOpenDialog(true);
  };

  const handleSave = async () => {
    // Validación básica
    if (!planData.name || planData.price <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Datos incompletos',
        text: 'Por favor, completa todos los campos obligatorios.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (dialogMode === 'create') {
        await apiClient.post('/plans', planData);
        Swal.fire({
          icon: 'success',
          title: 'Plan creado',
          text: 'El plan ha sido creado con éxito.',
        });
      } else if (dialogMode === 'edit' && selectedPlanId) {
        await apiClient.put(`/plans/${selectedPlanId}`, planData);
        Swal.fire({
          icon: 'success',
          title: 'Plan actualizado',
          text: 'El plan ha sido actualizado con éxito.',
        });
      }
      setOpenDialog(false);
      fetchPlans();
    } catch (err) {
      console.error(`Error al ${dialogMode === 'create' ? 'crear' : 'actualizar'} plan:`, err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Ocurrió un error al ${dialogMode === 'create' ? 'crear' : 'actualizar'} el plan.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleArchive = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Quieres archivar (desactivar) este plan?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, archivar!',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;
    
    setArchivingPlanId(id);
    try {
      await apiClient.delete(`/plans/${id}`);
      fetchPlans();
      Swal.fire({
        icon: 'success',
        title: 'Plan archivado',
        text: 'El plan ha sido archivado con éxito.',
      });
    } catch (err) {
      console.error('Error al archivar el plan:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo archivar el plan.',
      });
    } finally {
      setArchivingPlanId(null);
    }
  };

  const handleCloseDialog = () => {
    if (!isSubmitting) {
      setOpenDialog(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ my: 3 }}>
        Gestión de Planes
      </Typography>

      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleOpenCreate} 
        sx={{ mb: 2 }}
        disabled={loading}
      >
        Crear Nuevo Plan
      </Button>

      {/* Indicador de carga principal */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {error && <Typography color="error">{error}</Typography>}

      {!loading && !error && plans.length > 0 && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Duración (meses)</TableCell>
              <TableCell>Descuento (%)</TableCell>
              <TableCell>Razón Descuento</TableCell>
              <TableCell>Versión</TableCell>
              <TableCell>Activo</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell>{plan.id}</TableCell>
                <TableCell>{plan.name}</TableCell>
                <TableCell>${plan.price}</TableCell>
                <TableCell>{plan.durationMonths || 1}</TableCell>
                <TableCell>{plan.discount || 0}%</TableCell>
                <TableCell>{plan.discountReason || '--'}</TableCell>
                <TableCell>{plan.versionNumber}</TableCell>
                <TableCell>{plan.active ? 'Sí' : 'No'}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    color="info"
                    onClick={() => handleOpenEdit(plan)}
                    sx={{ mr: 1, mb: 1 }}
                    disabled={loading || archivingPlanId === plan.id}
                  >
                    Editar/Versionar
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    color="warning"
                    onClick={() => handleArchive(plan.id!)}
                    disabled={loading || archivingPlanId !== null}
                    sx={{ position: 'relative', minWidth: '90px' }}
                  >
                    {archivingPlanId === plan.id ? (
                      <>
                        <CircularProgress
                          size={24}
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            marginTop: '-12px',
                            marginLeft: '-12px',
                          }}
                        />
                        <span style={{ visibility: 'hidden' }}>Archivar</span>
                      </>
                    ) : (
                      'Archivar'
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {!loading && !error && plans.length === 0 && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          No hay planes registrados.
        </Typography>
      )}

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="sm" 
        fullWidth
        disableEscapeKeyDown={isSubmitting}
      >
        <DialogTitle>
          {dialogMode === 'create' ? 'Crear Plan' : 'Editar / Versionar Plan'}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre"
            variant="outlined"
            fullWidth
            margin="normal"
            value={planData.name}
            onChange={(e) => setPlanData({ ...planData, name: e.target.value })}
            disabled={isSubmitting}
            required
          />
          <TextField
            label="Precio"
            type="number"
            variant="outlined"
            fullWidth
            margin="normal"
            value={planData.price}
            onChange={(e) => setPlanData({ ...planData, price: Number(e.target.value) })}
            disabled={isSubmitting}
            required
            inputProps={{ min: 0 }}
          />
          <TextField
            label="Duración (meses)"
            type="number"
            variant="outlined"
            fullWidth
            margin="normal"
            value={planData.durationMonths}
            onChange={(e) => setPlanData({ ...planData, durationMonths: Number(e.target.value) })}
            inputProps={{ min: 1 }}
            disabled={isSubmitting}
            required
          />
          <TextField
            label="Descripción"
            variant="outlined"
            fullWidth
            margin="normal"
            value={planData.description}
            onChange={(e) => setPlanData({ ...planData, description: e.target.value })}
            disabled={isSubmitting}
            multiline
            rows={3}
          />
          <TextField
            label="Descuento (%)"
            type="number"
            variant="outlined"
            fullWidth
            margin="normal"
            value={planData.discount}
            onChange={(e) => setPlanData({ ...planData, discount: Number(e.target.value) })}
            disabled={isSubmitting}
            inputProps={{ min: 0, max: 100 }}
          />
          <TextField
            label="Razón del Descuento"
            variant="outlined"
            fullWidth
            margin="normal"
            value={planData.discountReason}
            onChange={(e) => setPlanData({ ...planData, discountReason: e.target.value })}
            disabled={isSubmitting}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseDialog} 
            color="inherit"
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            color="primary"
            disabled={isSubmitting}
            sx={{ position: 'relative', minWidth: '90px' }}
          >
            {isSubmitting ? (
              <>
                <CircularProgress
                  size={24}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                  }}
                />
                <span style={{ visibility: 'hidden' }}>
                  {dialogMode === 'create' ? 'Crear' : 'Guardar'}
                </span>
              </>
            ) : (
              dialogMode === 'create' ? 'Crear' : 'Guardar'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminPlanCrudPage;