// src/components/layout/ProductForm.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
} from '@mui/material';
import { Category } from '../../Store/services/CategoryService';
import { FormErrorMessage } from '../components/FormErrorMessage';

// Esquema de validación
const validationSchema = Yup.object().shape({
  name: Yup.string().required('El nombre es requerido'),
  description: Yup.string()
    .required('La descripción es requerida')
    .max(500, 'La descripción no puede tener más de 500 caracteres'),
  category: Yup.string().required('La categoría es requerida'),
  price: Yup.number().min(0, 'El precio debe ser mayor o igual a 0').required('El precio es requerido'),
  brand: Yup.string().required('La marca es requerida'),
  flavor: Yup.string().required('El sabor es requerido'),
});

// Tipado de las props que recibe
interface ProductFormProps {
  initialValues: any;
  categories: Category[];
  onSubmit: (values: any) => void;
  onClose: () => void; 
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialValues,
  categories,
  onSubmit,
  onClose,
}) => {
  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        onSubmit(values);
        // Opcional: resetear el formulario
        resetForm();
      }}
    >
      {({ setFieldValue, handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <DialogTitle>
            {initialValues?.name ? 'Editar Producto' : 'Crear Producto'}
          </DialogTitle>
          <DialogContent dividers>
            {/* Nombre */}
            <Field name="name">
              {({ field }: any) => (
                <TextField {...field} label="Nombre" fullWidth margin="normal" />
              )}
            </Field>
            <FormErrorMessage name="name" />

            {/* Descripción */}
            <Field name="description">
              {({ field }: any) => (
                <TextField
                  {...field}
                  label="Descripción"
                  fullWidth
                  margin="normal"
                  multiline
                  rows={3}
                />
              )}
            </Field>
            <FormErrorMessage name="description" />

            {/* Categoría */}
            <Field name="category">
              {({ field }: any) => (
                <FormControl fullWidth margin="normal">
                  <InputLabel id="category-label">Categoría</InputLabel>
                  <Select labelId="category-label" {...field} value={field.value || ''}>
                    <MenuItem value="">
                      <em>Seleccione una categoría</em>
                    </MenuItem>
                    {categories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Field>
            <FormErrorMessage name="category" />

            {/* Marca */}
            <Field name="brand">
              {({ field }: any) => (
                <TextField {...field} label="Marca" fullWidth margin="normal" />
              )}
            </Field>
            <FormErrorMessage name="brand" />

            {/* Sabor */}
            <Field name="flavor">
              {({ field }: any) => (
                <TextField {...field} label="Sabor" fullWidth margin="normal" />
              )}
            </Field>
            <FormErrorMessage name="flavor" />

            {/* Precio */}
            <Field name="price">
              {({ field }: any) => (
                <TextField {...field} label="Precio" type="number" fullWidth margin="normal" />
              )}
            </Field>
            <FormErrorMessage name="price" />

            {/* Stock */}
            <Field name="stock">
              {({ field }: any) => (
                <TextField {...field} label="Stock" type="number" fullWidth margin="normal" />
              )}
            </Field>
            <FormErrorMessage name="stock" />

            {/* Imagen (opcional) */}
            <div style={{ marginTop: '1rem' }}>
              <Typography variant="subtitle1" gutterBottom>
                Imagen (opcional)
              </Typography>
              <input
                type="file"
                onChange={(event) => {
                  if (event.currentTarget.files?.[0]) {
                    setFieldValue('imageFile', event.currentTarget.files[0]);
                  }
                }}
              />
            </div>
          </DialogContent>

          <DialogActions>
            <Button onClick={onClose}>Cancelar</Button>
            <Button type="submit" variant="contained" color="primary">
              {initialValues?.name ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </Form>
      )}
    </Formik>
  );
};
