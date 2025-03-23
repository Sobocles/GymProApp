import React from 'react';
import { useParams } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  TableContainer,
  CircularProgress 
} from '@mui/material';
import { useSearch } from '../../Admin/hooks/useSearch';
import { Paginator } from '../components/Paginator';
import { ProductList } from '../components/ProductList';
import { ProductModalForm } from '../components/ProductModalForm';
import { useProductCrud } from '../hooks/useProductCrud';
import LoadingSpinner from '../../components/LoadingSpinner';

export const ProductCrud: React.FC = () => {
  const { searchTerm, setSearchTerm } = useSearch();
  const { page = '0' } = useParams();
  const currentPage = parseInt(page, 10);
  
  // Hook que maneja toda la lógica
  const {
    products,
    paginator,
    categories,
    selectedProduct,
    openDialog,
    isLoading,
    isSubmitting,
    deletingProductId,
    handlerCreateProduct,
    handlerUpdateProduct,
    handlerDeleteProduct,
    handleOpenCreate,
    handleEdit,
    handleCloseDialog,
  } = useProductCrud(currentPage, searchTerm);

  // Si está cargando inicialmente y no hay productos, mostrar el spinner a pantalla completa
  if (isLoading && products.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <Box sx={{ margin: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Productos
      </Typography>
      
      {/* Botón crear */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenCreate}
        sx={{ mb: 2, mr: 2 }}
        disabled={isSubmitting || isLoading}
      >
        Crear Producto
      </Button>
      
      {/* Barra de búsqueda */}
      <TextField
        label="Buscar productos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        size="small"
        sx={{ mb: 2, width: '300px' }}
        disabled={isLoading}
      />
      
      {/* Indicador de carga para los datos */}
      {isLoading && products.length > 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {products.length === 0 ? (
            <Typography>No hay productos registrados.</Typography>
          ) : (
            <TableContainer component={Paper} sx={{ mb: 2 }}>
              <ProductList
                products={products}
                onEdit={handleEdit}
                onDelete={handlerDeleteProduct}
                isLoading={isLoading}
                deletingProductId={deletingProductId}
              />
            </TableContainer>
          )}
        </>
      )}
      
      {/* Modal Form */}
      <ProductModalForm
        open={openDialog}
        onClose={handleCloseDialog}
        productSelected={selectedProduct}
        categories={categories}
        onCreate={handlerCreateProduct}
        onUpdate={handlerUpdateProduct}
        isSubmitting={isSubmitting}
      />
      
      {/* Paginador */}
      {!isLoading && searchTerm === '' && paginator.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Paginator
            url="/admin/store/products"
            paginator={{
              number: paginator.number,
              totalPages: paginator.totalPages,
              first: paginator.first,
              last: paginator.last,
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default ProductCrud;