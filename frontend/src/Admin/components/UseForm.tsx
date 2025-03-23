/* eslint-disable @typescript-eslint/no-explicit-any */
// src/Admin/components/UseForm.tsx
import { useFormik } from 'formik';
import { UserInterface } from '../../Auth/Interfaces/UserInterface';
import { 
  TextField, 
  Button, 
  Checkbox, 
  FormControlLabel, 
  Box, 
  Typography, 
  CircularProgress,
  Alert,
  FormHelperText
} from '@mui/material';
import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

interface UserFormProps {
  userSelected: UserInterface;
  handlerAddUser: (user: UserInterface) => void;
  handlerCloseForm: () => void;
}

export const UserForm = ({ userSelected, handlerAddUser, handlerCloseForm }: UserFormProps) => {
  // Si el usuario ya tenía trainer true, asumimos que se quiere editar (o crear) un entrenador
  const [isTrainer, setIsTrainer] = useState(userSelected.trainer || false);
  
  // Usando isLoading desde el estado
  const { isLoading, errors } = useSelector((state: any) => state.users);
  
  // Estado para la vista previa del archivo
  const [filePreview, setFilePreview] = useState<string | null>(null);
  
  // Estado para guardar el archivo
  const [certFile, setCertFile] = useState<File | null>(null);

  // Esquema de validación
  const validationSchema = Yup.object({
    username: Yup.string()
      .required('El nombre de usuario es obligatorio')
      .min(3, 'El nombre debe tener al menos 3 caracteres'),
    email: Yup.string()
      .email('Debe ser un email válido')
      .required('El email es obligatorio'),
    admin: Yup.boolean(),
    trainer: Yup.boolean(),
    // Validar los campos de entrenador solo si esTrainer es true
    specialization: isTrainer ? Yup.string().required('Especialización es requerida') : Yup.string(),
    experienceYears: isTrainer ? 
      Yup.number()
        .typeError('Debe ser un número')
        .required('Años de experiencia son requeridos')
        .min(0, 'No puede ser negativo') 
      : Yup.number(),
    availability: isTrainer ? Yup.boolean().required('Disponibilidad es requerida') : Yup.boolean(),
    monthlyFee: isTrainer ? 
      Yup.number()
        .typeError('Debe ser un número')
        .required('Cuota mensual es requerida')
        .min(0, 'No puede ser negativo') 
      : Yup.number(),
    title: isTrainer ? Yup.string().required('Título es requerido') : Yup.string(),
    studies: isTrainer ? Yup.string().required('Estudios son requeridos') : Yup.string(),
    certifications: isTrainer ? Yup.string().required('Certificaciones son requeridas') : Yup.string(),
    description: isTrainer ? Yup.string().required('Descripción es requerida') : Yup.string(),
    instagramUrl: Yup.string().notRequired(),
    whatsappNumber: Yup.string().notRequired(),
  });

  // Valores iniciales para el formulario
  const initialTrainerValues = userSelected?.trainer ? {
    // Si es una edición de un entrenador, usar los valores del entrenador seleccionado
    specialization: userSelected.trainerDetails?.specialization || '',
    experienceYears: userSelected.trainerDetails?.experienceYears || 0,
    availability: userSelected.trainerDetails?.availability || false,
    monthlyFee: userSelected.trainerDetails?.monthlyFee || 0,
    title: userSelected.trainerDetails?.title || '',
    studies: userSelected.trainerDetails?.studies || '',
    certifications: userSelected.trainerDetails?.certifications || '',
    description: userSelected.trainerDetails?.description || '',
    instagramUrl: userSelected.trainerDetails?.instagramUrl || '',
    whatsappNumber: userSelected.trainerDetails?.whatsappNumber || '',
  } : {
    // Si es un nuevo entrenador, usar valores por defecto
    specialization: '',
    experienceYears: 0,
    availability: true,
    monthlyFee: 0,
    title: '',
    studies: '',
    certifications: '',
    description: '',
    instagramUrl: '',
    whatsappNumber: '',
  };

  const formik = useFormik({
    initialValues: {
      id: userSelected?.id ?? 0,
      username: userSelected?.username || '',
      email: userSelected?.email || '',
      password: '',
      admin: userSelected?.admin || false,
      trainer: userSelected?.trainer || false,
      // Valores iniciales para campos de entrenador
      ...initialTrainerValues,
      certificationFile: undefined,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (isLoading) return; // Prevenir múltiples envíos

      console.log('Token antes de enviar formulario:', sessionStorage.getItem('token'));

      const userToSave: UserInterface = {
        ...values,
        trainer: values.trainer,
        // Solo se crea trainerDetails si trainer es true
        trainerDetails: values.trainer
          ? {
              specialization: values.specialization,
              experienceYears: Number(values.experienceYears),
              availability: values.availability,
              monthlyFee: Number(values.monthlyFee),
              title: values.title,
              studies: values.studies,
              certifications: values.certifications,
              description: values.description,
              instagramUrl: values.instagramUrl,
              whatsappNumber: values.whatsappNumber,
            }
          : undefined,
          certificationFile: certFile || undefined
      };

      // Llamamos al handler con el objeto ya reestructurado
      handlerAddUser(userToSave);
    },
  });

  // Efecto para actualizar los campos del formulario cuando cambia isTrainer
  useEffect(() => {
    // Si el usuario marca la casilla de entrenador, establecer valores iniciales para campos de entrenador
    if (isTrainer) {
      formik.setValues({
        ...formik.values,
        ...initialTrainerValues,
        trainer: true
      });
    }
  }, [isTrainer]);

  const handleTrainerCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsTrainer(e.target.checked);
    formik.handleChange(e);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files && e.currentTarget.files.length > 0) {
      const file = e.currentTarget.files[0];
      setCertFile(file);
      
      // Crear vista previa para imágenes
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        // Para PDF u otros archivos, simplemente mostrar el nombre
        setFilePreview(null);
      }
    }
  };

  // Determinar si el botón de envío debe estar deshabilitado
  const isSubmitDisabled = isLoading || (isTrainer && !formik.isValid);

  return (
    <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ overflowY: 'auto' }}>
      {errors.errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.errorMessage}
        </Alert>
      )}

      <TextField
        fullWidth
        margin="normal"
        label="Nombre de Usuario"
        name="username"
        value={formik.values.username}
        onChange={formik.handleChange}
        error={formik.touched.username && Boolean(formik.errors.username)}
        helperText={formik.touched.username && formik.errors.username}
        disabled={isLoading}
        required
      />

      <TextField
        fullWidth
        margin="normal"
        label="Email"
        name="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
        disabled={isLoading}
        required
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={formik.values.admin}
            onChange={formik.handleChange}
            name="admin"
            color="primary"
            disabled={isLoading}
          />
        }
        label="Admin"
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={formik.values.trainer}
            onChange={handleTrainerCheckbox}
            name="trainer"
            color="primary"
            disabled={isLoading}
          />
        }
        label="Entrenador"
      />

      {/* Si es entrenador, mostramos los campos adicionales */}
      {isTrainer && (
        <>
          <Typography variant="h6" sx={{ mt: 2 }}>Información del Entrenador</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Todos los campos con * son obligatorios
          </Typography>
          
          <TextField
            fullWidth
            margin="normal"
            label="Especialización"
            name="specialization"
            value={formik.values.specialization}
            onChange={formik.handleChange}
            error={formik.touched.specialization && Boolean(formik.errors.specialization)}
            helperText={formik.touched.specialization && formik.errors.specialization}
            disabled={isLoading}
            required
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="Años de Experiencia"
            name="experienceYears"
            type="number"
            value={formik.values.experienceYears}
            onChange={formik.handleChange}
            error={formik.touched.experienceYears && Boolean(formik.errors.experienceYears)}
            helperText={formik.touched.experienceYears && formik.errors.experienceYears}
            disabled={isLoading}
            required
            inputProps={{ min: 0 }}
          />
          
          <FormControlLabel
            control={
              <Checkbox
                checked={formik.values.availability}
                onChange={formik.handleChange}
                name="availability"
                color="primary"
                disabled={isLoading}
              />
            }
            label="Disponible"
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="Cuota Mensual"
            name="monthlyFee"
            type="number"
            value={formik.values.monthlyFee}
            onChange={formik.handleChange}
            error={formik.touched.monthlyFee && Boolean(formik.errors.monthlyFee)}
            helperText={formik.touched.monthlyFee && formik.errors.monthlyFee}
            disabled={isLoading}
            required
            inputProps={{ min: 0 }}
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="Título"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
            disabled={isLoading}
            required
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="Estudios"
            name="studies"
            value={formik.values.studies}
            onChange={formik.handleChange}
            error={formik.touched.studies && Boolean(formik.errors.studies)}
            helperText={formik.touched.studies && formik.errors.studies}
            disabled={isLoading}
            required
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="Certificaciones"
            name="certifications"
            value={formik.values.certifications}
            onChange={formik.handleChange}
            error={formik.touched.certifications && Boolean(formik.errors.certifications)}
            helperText={formik.touched.certifications && formik.errors.certifications}
            disabled={isLoading}
            required
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="Descripción"
            name="description"
            multiline
            rows={4}
            value={formik.values.description}
            onChange={formik.handleChange}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
            disabled={isLoading}
            required
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="Instagram (opcional)"
            name="instagramUrl"
            value={formik.values.instagramUrl}
            onChange={formik.handleChange}
            disabled={isLoading}
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="WhatsApp (opcional)"
            name="whatsappNumber"
            value={formik.values.whatsappNumber}
            onChange={formik.handleChange}
            disabled={isLoading}
          />
          
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Certificación (PDF / imagen)
          </Typography>
          
          <input
            type="file"
            name="certificationFile"
            onChange={handleFileChange}
            disabled={isLoading}
            accept="image/*,.pdf"
          />
          
          {certFile && (
            <FormHelperText>
              Archivo seleccionado: {certFile.name} ({Math.round(certFile.size / 1024)} KB)
            </FormHelperText>
          )}
          
          {filePreview && (
            <Box mt={2}>
              <img src={filePreview} alt="Vista previa" style={{ maxWidth: '100%', maxHeight: '200px' }} />
            </Box>
          )}
        </>
      )}

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          variant="outlined" 
          color="secondary" 
          onClick={handlerCloseForm} 
          disabled={isLoading}
        >
          Cerrar
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          type="submit"
          disabled={isSubmitDisabled}
          sx={{ position: 'relative', minWidth: '120px' }}
        >
          {isLoading ? (
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
                {formik.values.id ? 'Editar' : 'Crear'}
              </span>
            </>
          ) : (
            formik.values.id ? 'Editar' : 'Crear'
          )}
        </Button>
      </Box>
    </Box>
  );
};