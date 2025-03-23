import React from 'react';
import { useLocation, useParams, Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  TextField,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Button
} from '@mui/material';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';

import { useSearch } from '../../Admin/hooks/useSearch';
import { Product } from '../../Store/interface/Product';
import { Paginator } from '../../Admin/components/Paginator';
import FilterSection from '../components/FilterSection';
import { useProducts } from '../../Hooks/useProducts';
import { addToCart } from '../../Store/Store/slices/cartSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';


/**
 * Calcula el precio final con descuento si está en rango de fechas.
 * Retorna un objeto con:
 *   - originalPrice (number)
 *   - finalPrice (number)
 *   - isDiscountActive (boolean)
 *   - discountReason (string | null)
 */
function getDiscountedPrice(product: Product) {
  const now = new Date();

  // Parsear discountStart y discountEnd si existen
  const start = product.discountStart ? new Date(product.discountStart) : null;
  const end = product.discountEnd ? new Date(product.discountEnd) : null;

  // Chequear si 'hoy' está dentro del rango [start, end] y si discountPercent > 0
  let isDiscountActive = false;
  if (
    product.discountPercent &&
    product.discountPercent > 0 &&
    start && end &&
    now >= start &&
    now <= end
  ) {
    isDiscountActive = true;
  }

  // Calcular precios
  const originalPrice = product.price;
  let finalPrice = product.price;

  if (isDiscountActive) {
    finalPrice = finalPrice - (finalPrice * product.discountPercent / 100);
  }

  return {
    originalPrice,
    finalPrice,
    isDiscountActive,
    discountReason: isDiscountActive ? product.discountReason : null
  };
}


const StoreHomePage: React.FC = () => {
  const { searchTerm, setSearchTerm } = useSearch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category');
  const { page } = useParams();
  const pageNumber = page ? parseInt(page, 10) : 0;

  // Hook para despachar acciones
  const dispatch = useDispatch();
  const navigate = useNavigate(); // si quieres redirigir en algún momento

  const cartItems = useSelector((state: RootState) => state.cart.items);

  const isSearching = searchTerm.trim() !== '';

  // Hook personalizado
  const {
    products,
    paginator,
    loading,
    sortBy,
    setSortBy,
    checkBoxInStock,
    setCheckBoxInStock,
    selectedBrands,
    setSelectedBrands,
    selectedFlavors,
    setSelectedFlavors,
    priceRange,
    setPriceRange,
    brands,
    flavors,
  } = useProducts({
    searchTerm,
    category,
    pageNumber,
  });

  // Manejar ordenamiento
  const handleSortChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newSort = event.target.value as string;
    setSortBy(newSort);
  };

  // Filtrado adicional en front (si lo deseas)
  const finalProducts = products.filter((p) => {
    return p.price >= priceRange[0] && p.price <= priceRange[1];
  });

  // Al hacer clic en “Agregar al carrito”
  const handleAddToCart = (product: Product, availableStock: number) => {
    if (availableStock > 0) {
      dispatch(addToCart({ product, quantity: 1 }));
      Swal.fire({
        title: '¡Agregado!',
        text: `Has agregado "${product.name}" al carrito.`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        title: 'Sin stock',
        text: 'Lo sentimos, este producto se encuentra agotado.',
        icon: 'error',
      });
    }
  };
  

  return (
    <Box display="flex" padding={2}>
      {/* Columna lateral de filtros */}
      <Box width="20%" paddingRight={2}>
        <FilterSection
          checkBoxInStock={checkBoxInStock}
          setCheckBoxInStock={setCheckBoxInStock}
          selectedBrands={selectedBrands}
          setSelectedBrands={setSelectedBrands}
          selectedFlavors={selectedFlavors}
          setSelectedFlavors={setSelectedFlavors}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          brands={brands}
          flavors={flavors}
        />
      </Box>

      <Box flex={1}>
        {/* Encabezado y Orden */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          position="relative"
        >
          <Typography variant="h4" gutterBottom>
            {category ? `Productos de ${category}` : 'Todos los Productos'}
          </Typography>

          {/* Dropdown de ordenamiento */}
          <Box sx={{ position: 'absolute', right: '120px', top: '50px' }}>
            <FormControl sx={{ minWidth: 200 }} size="small">
              <InputLabel id="sort-select-label">Ordenar</InputLabel>
              <Select
                labelId="sort-select-label"
                value={sortBy}
                onChange={handleSortChange}
              >
                <MenuItem value="price_asc">Precio: Menor a Mayor</MenuItem>
                <MenuItem value="price_desc">Precio: Mayor a Menor</MenuItem>
                <MenuItem value="best_selling">Más Vendidos</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Barra de búsqueda */}
        <Box mb={4}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            label="Buscar"
            sx={{ maxWidth: '300px' }}
          />
        </Box>

        {loading ? (
          <Typography variant="body1">Cargando productos...</Typography>
        ) : !finalProducts || finalProducts.length === 0 ? (
          <Typography variant="body1">No se encontraron productos.</Typography>
        ) : (
          <Grid container spacing={2}>
 {finalProducts.map((product) => {
  // Calculamos los datos de descuento
  const {
    originalPrice,
    finalPrice,
    isDiscountActive,
    discountReason,
  } = getDiscountedPrice(product);

  // Obtenemos la cantidad que ya se agregó al carrito para este producto
  const cartItem = cartItems.find(item => item.product.id === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;
  // Calculamos el stock disponible (stock original menos la cantidad en el carrito)
  const availableStock = product.stock - quantityInCart;

  return (
    <Grid item xs={12} sm={6} md={3} key={product.id}>
      <Box
        sx={{
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: 2,
          textAlign: 'center',
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {isDiscountActive && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              backgroundColor: 'red',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '0 0 4px 0',
            }}
          >
            ¡Oferta!
          </Box>
        )}

        {product.imageUrl && (
          <Box
            sx={{
              width: '100%',
              height: '180px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              marginBottom: '8px',
            }}
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{
                width: 'auto',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </Box>
        )}

        <Typography
          variant="h6"
          component={Link}
          to={`/store/product/${product.id}`}
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          {product.name}
        </Typography>

        {/* Mostrar stock disponible basado en lo agregado al carrito */}
        <Typography variant="body2" sx={{ mt: 1 }}>
          Stock disponible: {availableStock} unidades
        </Typography>

        {isDiscountActive ? (
          <Box sx={{ mt: 1, mb: 2 }}>
            <Typography
              variant="body2"
              sx={{ textDecoration: 'line-through', color: 'gray' }}
            >
              ${originalPrice.toFixed(2)}
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: 'red', fontWeight: 'bold' }}
            >
              ${finalPrice.toFixed(2)}
            </Typography>
            {discountReason && (
              <Typography
                variant="body2"
                sx={{ color: 'red', fontStyle: 'italic' }}
              >
                {discountReason}
              </Typography>
            )}
          </Box>
        ) : (
          <Typography variant="h6" sx={{ my: 2 }}>
            ${originalPrice.toFixed(2)}
          </Typography>
        )}

        {/* Botón Agregar al Carrito */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleAddToCart(product, availableStock)}
        >
          Agregar al Carrito
        </Button>
      </Box>
    </Grid>
  );
})}

          </Grid>
        )}

        {/* Paginador (solo si NO estamos buscando) */}
        {!isSearching && paginator.totalPages > 1 && (
          <Paginator
            url="/store"
            paginator={{
              number: paginator.number,
              totalPages: paginator.totalPages,
              first: paginator.first,
              last: paginator.last,
            }}
            sortBy={sortBy}
          />
        )}
      </Box>
    </Box>
  );
};

export default StoreHomePage;
