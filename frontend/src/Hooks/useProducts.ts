// src/Store/hooks/useProducts.ts
import { useEffect, useState } from 'react';
import { Product } from '../Store/interface/Product';
import {
  advancedSearchProducts,
  getDistinctBrands,
  getProductsBySearch,
  getDistinctFlavors,
} from '../Store/services/ProductService';

interface PaginatorState {
  totalPages: number;
  number: number;
  first: boolean;
  last: boolean;
}

interface UseProductsProps {
  searchTerm: string;
  category: string | null;
  pageNumber: number;
}

interface UseProductsReturn {
  products: Product[];
  paginator: PaginatorState;
  loading: boolean;
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  checkBoxInStock: boolean;
  setCheckBoxInStock: React.Dispatch<React.SetStateAction<boolean>>;
  selectedBrands: string[];
  setSelectedBrands: React.Dispatch<React.SetStateAction<string[]>>;
  selectedFlavors: string[];
  setSelectedFlavors: React.Dispatch<React.SetStateAction<string[]>>;
  priceRange: number[];
  setPriceRange: React.Dispatch<React.SetStateAction<number[]>>;
  brands: string[];
  flavors: string[];     
}

export const useProducts = ({
  searchTerm,
  category,
  pageNumber,
}: UseProductsProps): UseProductsReturn => {
  // Estados internos del hook
  const [products, setProducts] = useState<Product[]>([]);
  const [paginator, setPaginator] = useState<PaginatorState>({
    totalPages: 0,
    number: 0,
    first: true,
    last: false,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [brands, setBrands] = useState<string[]>([]);
  const [flavors, setFlavors] = useState<string[]>([]);   

  // Estados para ordenamiento y filtros
  const [sortBy, setSortBy] = useState<string>('price_asc');
  const [checkBoxInStock, setCheckBoxInStock] = useState<boolean>(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 100000]);

  const isSearching = searchTerm.trim() !== '';

  useEffect(() => {
    const fetchProductsAndFilters = async () => {
      setLoading(true);
      try {
        // 1) Obtener Marcas únicas
        const brandsResponse = await getDistinctBrands();
        setBrands(brandsResponse);

        // 2) Obtener Sabores únicos <-- Aquí
        const flavorsResponse = await getDistinctFlavors();
        setFlavors(flavorsResponse);

        // 3) Cargar productos
        if (isSearching) {
          // Buscar en backend por nombre, o traer todo y filtrar:
          const foundProducts = await getProductsBySearch(searchTerm);
          setProducts(foundProducts);
          // Reiniciar paginador
          setPaginator({ totalPages: 0, number: 0, first: true, last: true });
        } else {
          // Filtros combinados
          const filters = {
            category: category || null,
            inStock: checkBoxInStock ? true : undefined,
            brands: selectedBrands,
            flavors: selectedFlavors,   // <-- Añade los sabores seleccionados
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
          };

          // Llamada avanzada con paginación
          const response = await advancedSearchProducts({
            page: pageNumber,
            size: 12,
            sortBy,
            ...filters,
          });

          setProducts(response.content);
          setPaginator({
            totalPages: response.totalPages,
            number: response.number,
            first: response.first,
            last: response.last,
          });
        }

      } catch (error) {
        console.error('Error al cargar productos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndFilters();
  }, [
    isSearching,
    searchTerm,
    category,
    pageNumber,
    sortBy,
    checkBoxInStock,
    selectedBrands,
    selectedFlavors,
    priceRange,
  ]);

  return {
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
  };
};
