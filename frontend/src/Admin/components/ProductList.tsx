/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/ProductCrud/components/ProductList.tsx
import React from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  CircularProgress,
} from '@mui/material';
import { Product } from '../../Store/interface/Product';
// Importa la función de descuento (ajusta la ruta según corresponda)
import { getDiscountedPrice } from '../../services/DiscountedProductsService';

interface Props {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
  deletingProductId: number | null;
}

export const ProductList: React.FC<Props> = ({ 
  products, 
  onEdit, 
  onDelete, 
  isLoading = false,
  deletingProductId 
}) => {
  return (
    <Table>
      <TableHead>
      <TableRow>
        <TableCell><strong>ID</strong></TableCell>
        <TableCell><strong>Nombre</strong></TableCell>
        <TableCell><strong>Descripción</strong></TableCell>
        <TableCell><strong>Categoría</strong></TableCell>
        <TableCell><strong>Stock</strong></TableCell>
        <TableCell><strong>Marca</strong></TableCell>
        <TableCell><strong>Sabor</strong></TableCell>
        <TableCell><strong>Imagen</strong></TableCell>
        <TableCell><strong>Precio</strong></TableCell>
        <TableCell><strong>Acciones</strong></TableCell>
      </TableRow>
      </TableHead>
      <TableBody>
        {products.map((p) => (
          <TableRow key={p.id}>
            <TableCell>{p.id}</TableCell>
            <TableCell>{p.name}</TableCell>
            <TableCell>{p.description}</TableCell>
            <TableCell>
              {typeof p.category === 'string'
                ? p.category
                : (p.category as any)?.name ?? 'Sin categoría'}
            </TableCell>
            <TableCell>{p.stock}</TableCell>
            <TableCell>{p.brand || 'Sin marca'}</TableCell>
            <TableCell>{p.flavor || 'Sin sabor'}</TableCell>
            <TableCell>
              {p.imageUrl ? (
                <img src={p.imageUrl} alt={p.name} width="50" />
              ) : (
                'Sin imagen'
              )}
            </TableCell>
            <TableCell>
              {(() => {
                // Calcula el precio con descuento para el producto
                const { originalPrice, finalPrice, isDiscountActive, discountReason } = getDiscountedPrice(p);
                return isDiscountActive ? (
                  <>
                    <span style={{ textDecoration: 'line-through' }}>
                      ${originalPrice.toFixed(2)}
                    </span>{' '}
                    <strong style={{ color: 'red' }}>
                      ${finalPrice.toFixed(2)}
                    </strong>
                    {discountReason && (
                      <i style={{ color: 'red', marginLeft: 5 }}>
                        {discountReason}
                      </i>
                    )}
                  </>
                ) : (
                  <>${originalPrice.toFixed(2)}</>
                );
              })()}
            </TableCell>
            <TableCell>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => onEdit(p)}
                sx={{ mr: 1, mb: 1, width: '120px' }}
                disabled={isLoading || deletingProductId === p.id}
              >
                Editar
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => onDelete(p.id!)}
                sx={{ width: '120px', position: 'relative' }}
                disabled={isLoading || deletingProductId === p.id}
              >
                {deletingProductId === p.id ? (
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
                    <span style={{ visibility: 'hidden' }}>Eliminar</span>
                  </>
                ) : (
                  'Eliminar'
                )}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};