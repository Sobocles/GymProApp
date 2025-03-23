/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
} from '@mui/material';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// Interfaces
import { Product } from '../../Store/interface/Product';
import { Category } from '../../Store/services/CategoryService';

// Interfaz de Props
interface ProductModalFormProps {
  open: boolean;
  onClose: () => void;
  productSelected: Product | null;
  categories: Category[];
  onCreate: (formData: FormData) => void;
  onUpdate: (id: number, formData: FormData) => void;
  isSubmitting: boolean;
}

// Esquema de validación con Yup
const validationSchema = Yup.object().shape({
  name: Yup.string().required('El nombre es requerido'),
  description: Yup.string()
    .required('La descripción es requerida')
    .max(500, 'La descripción no puede tener más de 500 caracteres'),
  category: Yup.string().required('La categoría es requerida'),
  price: Yup.number()
    .min(0, 'El precio debe ser mayor o igual a 0')
    .required('El precio es requerido'),
  brand: Yup.string().required('La marca es requerida'),
  flavor: Yup.string().required('El sabor es requerido'),
  stock: Yup.number()
  .min(0, 'El stock debe ser mayor o igual a 0')
  .required('El stock es requerido'),
});

export const ProductModalForm: React.FC<ProductModalFormProps> = ({
  open,
  onClose,
  productSelected,
  categories,
  onCreate,
  onUpdate,
  isSubmitting,
}) => {
  
  // Valores iniciales para Formik
  const initialValues = {
    name: productSelected?.name || '',
    description: productSelected?.description || '',
    category: typeof productSelected?.category === 'string'
                ? productSelected?.category
                : (productSelected?.category as any)?.name || '',
    price: productSelected?.price || 0,
    stock: productSelected?.stock || 0,
    brand: productSelected?.brand || '',
    flavor: productSelected?.flavor || '',
    discountPercent: productSelected?.discountPercent || '',
    discountReason: productSelected?.discountReason || '',
    discountStart: productSelected?.discountStart || '',
    discountEnd: productSelected?.discountEnd || '',
    imageFile: null,
  };
  // Al enviar el formulario
  const handleSubmitFormik = async (values: typeof initialValues) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('description', values.description);
    formData.append('category', values.category);
    formData.append('price', values.price.toString());
    formData.append('stock', values.stock.toString());
    formData.append('brand', values.brand);
    formData.append('flavor', values.flavor);
    formData.append('discountPercent', values.discountPercent?.toString() || '');
    formData.append('discountReason', values.discountReason || '');
    formData.append('discountStart', values.discountStart || '');
    formData.append('discountEnd', values.discountEnd || '');
  
    if (values.imageFile) {
      formData.append('image', values.imageFile);
    }
  
    if (productSelected) {
      await onUpdate(productSelected.id!, formData);
    } else {
      await onCreate(formData);
    }
    
    // No cerramos el modal aquí, lo hará el hook cuando termine la operación
    // onClose();
  };
  

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      {/* Formik envuelve el Dialog entero */}
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={handleSubmitFormik}
      >
        {({ setFieldValue, handleSubmit, isValid, dirty }) => (
          // Notar que aquí `<Form>` engloba TANTO <DialogContent> COMO <DialogActions>
          <Form onSubmit={handleSubmit}>
            <DialogTitle>
              {productSelected ? 'Editar Producto' : 'Crear Producto'}
            </DialogTitle>

            <DialogContent dividers>
              {/* Campo: name */}
              <Field name="name">
                {({ field }: any) => (
                  <TextField
                    {...field}
                    label="Nombre"
                    fullWidth
                    margin="normal"
                    disabled={isSubmitting}
                  />
                )}
              </Field>
              <ErrorMessage name="name">
                {(msg) => <Typography color="error">{msg}</Typography>}
              </ErrorMessage>

              {/* Campo: description */}
              <Field name="description">
                {({ field }: any) => (
                  <TextField
                    {...field}
                    label="Descripción"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={3}
                    disabled={isSubmitting}
                  />
                )}
              </Field>
              <ErrorMessage name="description">
                {(msg) => <Typography color="error">{msg}</Typography>}
              </ErrorMessage>

              {/* Campo: category */}
              <Field name="category">
                {({ field }: any) => (
                  <FormControl fullWidth margin="normal" disabled={isSubmitting}>
                    <InputLabel id="select-category-label">Categoría</InputLabel>
                    <Select
                      labelId="select-category-label"
                      {...field}
                      value={field.value || ''}
                    >
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
              <ErrorMessage name="category">
                {(msg) => <Typography color="error">{msg}</Typography>}
              </ErrorMessage>

              {/* Campo: brand */}
              <Field name="brand">
                {({ field }: any) => (
                  <TextField
                    {...field}
                    label="Marca"
                    fullWidth
                    margin="normal"
                    disabled={isSubmitting}
                  />
                )}
              </Field>
              <ErrorMessage name="brand">
                {(msg) => <Typography color="error">{msg}</Typography>}
              </ErrorMessage>

              {/* Campo: flavor */}
              <Field name="flavor">
                {({ field }: any) => (
                  <TextField
                    {...field}
                    label="Sabor"
                    fullWidth
                    margin="normal"
                    disabled={isSubmitting}
                  />
                )}
              </Field>
              <ErrorMessage name="flavor">
                {(msg) => <Typography color="error">{msg}</Typography>}
              </ErrorMessage>

              {/* Campo: price */}
              <Field name="price">
                {({ field }: any) => (
                  <TextField
                    {...field}
                    label="Precio"
                    type="number"
                    fullWidth
                    margin="normal"
                    disabled={isSubmitting}
                  />
                )}
              </Field>
              <ErrorMessage name="price">
                {(msg) => <Typography color="error">{msg}</Typography>}
              </ErrorMessage>
              <Field name="discountPercent">
            {({ field }: any) => (
              <TextField
                {...field}
                label="Descuento (%)"
                type="number"
                fullWidth
                margin="normal"
                disabled={isSubmitting}
              />
            )}
          </Field>

          <Field name="discountReason">
            {({ field }: any) => (
              <TextField
                {...field}
                label="Razón de la Oferta"
                fullWidth
                margin="normal"
                disabled={isSubmitting}
              />
            )}
          </Field>

          <Field name="discountStart">
            {({ field }: any) => (
              <TextField
                {...field}
                label="Inicio de Oferta"
                type="datetime-local"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }} // Para mostrar la etiqueta arriba
                disabled={isSubmitting}
              />
            )}
          </Field>

          <Field name="discountEnd">
            {({ field }: any) => (
              <TextField
                {...field}
                label="Fin de Oferta"
                type="datetime-local"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                disabled={isSubmitting}
              />
            )}
          </Field>



              {/* Campo: stock */}
              <Field name="stock">
       
                {({ field }: any) => (
                  <TextField
                    {...field}
                    label="Stock"
                    type="number"
                    fullWidth
                    margin="normal"
                    disabled={isSubmitting}
                  />
                )}
              </Field>
              <ErrorMessage name="stock">
                {(msg) => <Typography color="error">{msg}</Typography>}
              </ErrorMessage>

              {/* Campo: imagen (opcional) */}
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
                  disabled={isSubmitting}
                />
              </div>
            </DialogContent>

            {/* Botones dentro del mismo <Form> */}
            <DialogActions>
              <Button onClick={onClose} disabled={isSubmitting}>Cancelar</Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disabled={isSubmitting || !dirty || !isValid}
                sx={{ position: 'relative', minWidth: '120px' }}
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
                      {productSelected ? 'Actualizar' : 'Crear'}
                    </span>
                  </>
                ) : (
                  productSelected ? 'Actualizar' : 'Crear'
                )}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};