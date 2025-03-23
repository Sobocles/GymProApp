import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
  getAllProducts,
  getProductsPage,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllCategories
} from '../../Store/services/ProductService';

import { Product } from '../../Store/interface/Product';

interface Category {
  id: number;
  name: string;
}

interface PaginatorState {
  number: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export const useProductCrud = (currentPage: number, searchTerm: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [paginator, setPaginator] = useState<PaginatorState>({
    number: 0,
    totalPages: 1,
    first: true,
    last: false,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  
  // Estados de carga
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null);

  // Cargar categorías e inicial (similar a fetchAllAndFilter / fetchProductsPage)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (searchTerm.trim() === '') {
          await fetchProductsPage();
          await fetchCategories();
        } else {
          await fetchAllAndFilter();
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [currentPage, searchTerm]);

  // Obtener productos paginados
  const fetchProductsPage = async () => {
    try {
      const data = await getProductsPage(currentPage, 6);
    
      setProducts(data.content);
      setPaginator({
        number: data.number,
        totalPages: data.totalPages,
        first: data.first,
        last: data.last,
      });
    } catch (error) {
      console.error('Error al obtener productos paginados:', error);
    }
  };

  // Obtener *todos* y filtrar en front
  const fetchAllAndFilter = async () => {
    try {
      const all = await getAllProducts();
      const filtered = all.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setProducts(filtered);
      setPaginator({
        number: 0,
        totalPages: 1,
        first: true,
        last: true,
      });
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  // Obtener categorías
  const fetchCategories = async () => {
    try {
      const categoriesData = await getAllCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
    }
  };

  // Crear producto
  const handlerCreateProduct = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await createProduct(formData);
      await fetchProductsPage();
      setOpenDialog(false); // Cerrar el modal después de éxito
      Swal.fire({
        title: 'Producto creado',
        text: 'El producto ha sido creado con éxito.',
        icon: 'success'
      });
    } catch (error) {
      console.error('Error al crear producto:', error);
      Swal.fire({
        title: 'Error',
        text: 'Ocurrió un error al guardar el producto.',
        icon: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Editar producto
  const handlerUpdateProduct = async (id: number, formData: FormData) => {
    setIsSubmitting(true);
    try {
      await updateProduct(id, formData);
      await fetchProductsPage();
      setOpenDialog(false); // Cerrar el modal después de éxito
      Swal.fire({
        title: 'Producto actualizado',
        text: 'El producto ha sido actualizado con éxito.',
        icon: 'success'
      });
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      Swal.fire({
        title: 'Error',
        text: 'Ocurrió un error al guardar el producto.',
        icon: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Eliminar producto
  const handlerDeleteProduct = async (productId: number) => {
    // Mostrar confirmación antes de eliminar
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede revertir",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        setDeletingProductId(productId);
        await deleteProduct(productId);
        await fetchProductsPage();
        Swal.fire({
          title: 'Producto eliminado',
          text: 'El producto ha sido eliminado con éxito.',
          icon: 'success'
        });
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        Swal.fire({
          title: 'Error',
          text: 'Ocurrió un error al eliminar el producto.',
          icon: 'error'
        });
      } finally {
        setDeletingProductId(null);
      }
    }
  };

  // Mostrar el modal en modo "Crear"
  const handleOpenCreate = () => {
    setSelectedProduct(null);
    setOpenDialog(true);
  };

  // Mostrar el modal en modo "Editar"
  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  // Cerrar modal
  const handleCloseDialog = () => {
    if (!isSubmitting) {
      setSelectedProduct(null);
      setOpenDialog(false);
    }
  };

  return {
    products,
    paginator,
    categories,
    selectedProduct,
    openDialog,
    isLoading,
    isSubmitting,
    deletingProductId,

    // funciones
    handlerCreateProduct,
    handlerUpdateProduct,
    handlerDeleteProduct,
    handleOpenCreate,
    handleEdit,
    handleCloseDialog,
  };
};