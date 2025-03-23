import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Checkbox,
  FormControlLabel,
  Divider,
} from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { addBodyMeasurement } from '../../services/trainerClientService';
import Swal from 'sweetalert2';

interface FormValues {
  date: Date;
  clientName: string;
  age: string;
  injuries: string;
  otherHealthInfo: string;
  medications: string;
  currentlyExercising: boolean;
  sportsPracticed: string;
  weight: string;
  bmi: string;
  relaxedArm: string;
  waist: string;
  midThigh: string;
  flexedArm: string;
  hips: string;
  calf: string;
  tricepFold: string;
  subscapularFold: string;
  bicepFold: string;
  suprailiacFold: string;
  sumOfFolds: string;
  percentageOfFolds: string;
  fatMass: string;
  leanMass: string;
  muscleMass: string;
  idealMinWeight: string;
  idealMaxWeight: string;
  trainerRecommendations: string;
  height: string;
  bodyFatPercentage: string;
}

interface AddMeasurementFormProps {
  clientId: number;
}

const AddMeasurementForm: React.FC<AddMeasurementFormProps> = ({ clientId }) => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  const validationSchema = Yup.object({
    date: Yup.date().required('Fecha de evaluación es requerida'),
    clientName: Yup.string(),
    age: Yup.number()
      .typeError('Debe ser un número')
      .positive('Debe ser positivo'),
    injuries: Yup.string(),
    otherHealthInfo: Yup.string(),
    medications: Yup.string(),
    currentlyExercising: Yup.boolean(),
    sportsPracticed: Yup.string(),
    weight: Yup.number()
      .typeError('Debe ser un número')
      .positive('Debe ser positivo')
      .required('Peso es requerido'),
    bmi: Yup.number()
      .typeError('Debe ser un número')
      .positive('Debe ser positivo'),
    relaxedArm: Yup.number()
      .typeError('Debe ser un número')
      .positive('Debe ser positivo'),
    waist: Yup.number()
      .typeError('Debe ser un número')
      .positive('Debe ser positivo'),
    midThigh: Yup.number()
      .typeError('Debe ser un número')
      .positive('Debe ser positivo'),
    flexedArm: Yup.number()
      .typeError('Debe ser un número')
      .positive('Debe ser positivo'),
    hips: Yup.number()
      .typeError('Debe ser un número')
      .positive('Debe ser positivo'),
    calf: Yup.number()
      .typeError('Debe ser un número')
      .positive('Debe ser positivo'),
    tricepFold: Yup.number()
      .typeError('Debe ser un número')
      .positive('Debe ser positivo'),
    subscapularFold: Yup.number()
      .typeError('Debe ser un número')
      .positive('Debe ser positivo'),
    bicepFold: Yup.number()
      .typeError('Debe ser un número')
      .positive('Debe ser positivo'),
    suprailiacFold: Yup.number()
      .typeError('Debe ser un número')
      .positive('Debe ser positivo'),
    sumOfFolds: Yup.number()
      .typeError('Debe ser un número')
      .positive('Debe ser positivo'),
    percentageOfFolds: Yup.number()
      .typeError('Debe ser un número')
      .positive('Debe ser positivo'),
    fatMass: Yup.number()
      .typeError('Debe ser un número')
      .positive('Debe ser positivo'),
    leanMass: Yup.number()
      .typeError('Debe ser un número')
      .positive('Debe ser positivo'),
    muscleMass: Yup.number()
      .typeError('Debe ser un número')
      .positive('Debe ser positivo'),
    idealMinWeight: Yup.number()
      .typeError('Debe ser un número')
      .positive('Debe ser positivo'),
    idealMaxWeight: Yup.number()
      .typeError('Debe ser un número')
      .positive('Debe ser positivo'),
    trainerRecommendations: Yup.string(),
    height: Yup.number()
      .typeError('Debe ser un número')
      .positive('Debe ser positivo')
      .required('Altura es requerida'),
    bodyFatPercentage: Yup.number()
      .typeError('Debe ser un número')
      .positive('Debe ser positivo')
      .required('Porcentaje de grasa es requerido'),
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      date: new Date(),
      clientName: '',
      age: '',
      injuries: '',
      otherHealthInfo: '',
      medications: '',
      currentlyExercising: false,
      sportsPracticed: '',
      weight: '',
      bmi: '',
      relaxedArm: '',
      waist: '',
      midThigh: '',
      flexedArm: '',
      hips: '',
      calf: '',
      tricepFold: '',
      subscapularFold: '',
      bicepFold: '',
      suprailiacFold: '',
      sumOfFolds: '',
      percentageOfFolds: '',
      fatMass: '',
      leanMass: '',
      muscleMass: '',
      idealMinWeight: '',
      idealMaxWeight: '',
      trainerRecommendations: '',
      height: '',
      bodyFatPercentage: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setSubmitError(null);
      try {
        const dateStr = format(values.date, "yyyy-MM-dd'T'HH:mm:ss");
        const measurementData = {
          ...values,
          date: dateStr,
          age: values.age ? Number(values.age) : 0, // Como 'age' no es requerido, asignamos 0 en caso de no tener valor
          weight: Number(values.weight),
          bmi: values.bmi ? Number(values.bmi) : 0,
          height: Number(values.height),
          bodyFatPercentage: Number(values.bodyFatPercentage),
          relaxedArm: values.relaxedArm ? Number(values.relaxedArm) : 0,
          waist: values.waist ? Number(values.waist) : 0,
          midThigh: values.midThigh ? Number(values.midThigh) : 0,
          flexedArm: values.flexedArm ? Number(values.flexedArm) : 0,
          hips: values.hips ? Number(values.hips) : 0,
          calf: values.calf ? Number(values.calf) : 0,
          tricepFold: values.tricepFold ? Number(values.tricepFold) : 0,
          subscapularFold: values.subscapularFold ? Number(values.subscapularFold) : 0,
          bicepFold: values.bicepFold ? Number(values.bicepFold) : 0,
          suprailiacFold: values.suprailiacFold ? Number(values.suprailiacFold) : 0,
          sumOfFolds: values.sumOfFolds ? Number(values.sumOfFolds) : 0,
          percentageOfFolds: values.percentageOfFolds ? Number(values.percentageOfFolds) : 0,
          fatMass: values.fatMass ? Number(values.fatMass) : 0,
          leanMass: values.leanMass ? Number(values.leanMass) : 0,
          muscleMass: values.muscleMass ? Number(values.muscleMass) : 0,
          idealMinWeight: values.idealMinWeight ? Number(values.idealMinWeight) : 0,
          idealMaxWeight: values.idealMaxWeight ? Number(values.idealMaxWeight) : 0,
        };

        await addBodyMeasurement(clientId, measurementData);
        formik.resetForm();

        Swal.fire({
          icon: 'success',
          title: '¡Medición guardada!',
          text: 'Los datos se han registrado correctamente',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Aceptar',
        });
      } catch (error: any) {
        console.error('Error al agregar medición:', error);
        setSubmitError(error.response?.data || 'Error al agregar la medición');
      }
    },
  });

  return (
    <Box sx={{ maxWidth: 600, margin: '0 auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Agregar Medición Corporal
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        {/* Fecha de Evaluación */}
        <Typography variant="h6">Fecha de Evaluación</Typography>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            label="Fecha y Hora"
            value={formik.values.date}
            onChange={(value: Date | null) => formik.setFieldValue('date', value)}
            renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
          />
        </LocalizationProvider>

        {/* Información del Socio */}
        <Typography variant="h6">Información del Socio</Typography>
        <Divider />
        <TextField
          fullWidth
          label="Nombre del Socio"
          margin="normal"
          {...formik.getFieldProps('clientName')}
        />
        <TextField
          fullWidth
          label="Edad"
          margin="normal"
          type="number"
          {...formik.getFieldProps('age')}
        />

        {/* Información de Salud */}
        <Typography variant="h6">Información de Salud</Typography>
        <Divider />
        <TextField fullWidth label="Lesiones" margin="normal" {...formik.getFieldProps('injuries')} />
        <TextField fullWidth label="Otros" margin="normal" {...formik.getFieldProps('otherHealthInfo')} />
        <TextField fullWidth label="Medicamentos" margin="normal" {...formik.getFieldProps('medications')} />

        {/* Información Deportiva */}
        <Typography variant="h6">Información Deportiva</Typography>
        <Divider />
        <FormControlLabel
          control={<Checkbox {...formik.getFieldProps('currentlyExercising')} />}
          label="Ejercita Actualmente"
        />
        <TextField fullWidth label="Deporte Practicado" margin="normal" {...formik.getFieldProps('sportsPracticed')} />

        {/* Información IMC */}
        <Typography variant="h6">Información IMC</Typography>
        <Divider />
        <TextField fullWidth label="Peso Actual (kg)" margin="normal" {...formik.getFieldProps('weight')} />
        <TextField fullWidth label="IMC" margin="normal" {...formik.getFieldProps('bmi')} />
        <TextField
          fullWidth
          label="Altura (cm)"
          margin="normal"
          type="number"
          {...formik.getFieldProps('height')}
          error={formik.touched.height && Boolean(formik.errors.height)}
          helperText={formik.touched.height && formik.errors.height}
        />
        <TextField
          fullWidth
          label="Porcentaje de Grasa Corporal (%)"
          margin="normal"
          type="number"
          {...formik.getFieldProps('bodyFatPercentage')}
          error={formik.touched.bodyFatPercentage && Boolean(formik.errors.bodyFatPercentage)}
          helperText={formik.touched.bodyFatPercentage && formik.errors.bodyFatPercentage}
        />

        {/* Información Perímetros Corporales */}
        <Typography variant="h6">Información Perímetros Corporales</Typography>
        <Divider />
        <TextField fullWidth label="Brazo Relajado" margin="normal" {...formik.getFieldProps('relaxedArm')} />
        <TextField fullWidth label="Cintura (mínimo)" margin="normal" {...formik.getFieldProps('waist')} />
        <TextField fullWidth label="Muslo Medio" margin="normal" {...formik.getFieldProps('midThigh')} />
        <TextField fullWidth label="Brazo Contraído" margin="normal" {...formik.getFieldProps('flexedArm')} />
        <TextField fullWidth label="Cadera (máximo)" margin="normal" {...formik.getFieldProps('hips')} />
        <TextField fullWidth label="Pantorrilla" margin="normal" {...formik.getFieldProps('calf')} />

        {/* Información Perfil Antropométrico */}
        <Typography variant="h6">Información Perfil Antropométrico</Typography>
        <Divider />
        <TextField fullWidth label="Tricipital" margin="normal" {...formik.getFieldProps('tricepFold')} />
        <TextField fullWidth label="Subescapular" margin="normal" {...formik.getFieldProps('subscapularFold')} />
        <TextField fullWidth label="Bicipital" margin="normal" {...formik.getFieldProps('bicepFold')} />
        <TextField fullWidth label="Supracrestideo" margin="normal" {...formik.getFieldProps('suprailiacFold')} />

        {/* Información de Interpretación */}
        <Typography variant="h6">Información de Interpretación de Datos</Typography>
        <Divider />
        <TextField fullWidth label="Suma de Pliegues" margin="normal" {...formik.getFieldProps('sumOfFolds')} />
        <TextField fullWidth label="% de Pliegues" margin="normal" {...formik.getFieldProps('percentageOfFolds')} />
        <TextField fullWidth label="Masa Adiposa (kg)" margin="normal" {...formik.getFieldProps('fatMass')} />
        <TextField fullWidth label="Masa Libre de Grasa (kg)" margin="normal" {...formik.getFieldProps('leanMass')} />
        <TextField fullWidth label="Masa Muscular (kg)" margin="normal" {...formik.getFieldProps('muscleMass')} />

        {/* Peso Ideal */}
        <Typography variant="h6">Peso Ideal</Typography>
        <Divider />
        <TextField fullWidth label="Peso Ideal Mínimo" margin="normal" {...formik.getFieldProps('idealMinWeight')} />
        <TextField fullWidth label="Peso Ideal Máximo" margin="normal" {...formik.getFieldProps('idealMaxWeight')} />
        <TextField fullWidth label="Recomendaciones para el Entrenador" margin="normal" {...formik.getFieldProps('trainerRecommendations')} />

        {submitError && <Alert severity="error" sx={{ mt: 2 }}>{submitError}</Alert>}
        {submitSuccess && <Alert severity="success" sx={{ mt: 2 }}>Medición añadida con éxito</Alert>}

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" color="primary" type="submit">
            Guardar
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddMeasurementForm;
