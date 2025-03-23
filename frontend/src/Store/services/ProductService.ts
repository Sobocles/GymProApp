/* eslint-disable @typescript-eslint/no-explicit-any */
    // src/Store/services/ProductService.ts
    import apiClient from '../../Apis/apiConfig';
import { Product } from '../interface/Product';
import { CartItem } from '../Store/slices/cartSlice';
import { Category } from './CategoryService';


interface ProductPage {
  content: Product[];
  number: number;      // página actual
  totalPages: number;  // total de páginas
  first: boolean;
  last: boolean;
 
}
  interface AdvancedSearchPayload {
    page: number;
    size: number;
    sortBy: string;
  
    // Filtros
    category?: string|null;
    inStock?: boolean;
    brands?: string[];
    flavors?: string[];
    minPrice?: number;
    maxPrice?: number;
    // ...
  }

  
  export const getAllProducts = async (): Promise<Product[]> => {
      console.log("AQUI LLEGA");
    const response = await apiClient.get('/store/products');
    console.log("AQUI LA RESPONSE",response);
    return response.data;
  };

 
  export const getProductsByCategory = async (categoryName: string): Promise<Product[]> => {
    const response = await apiClient.get('/store/products', {
      params: {
        category: categoryName,
      },
    });
    return response.data;
  };


  export const getProductById = async (id: number) => {
    console.log("AQUI ESTA EL ID DEL PRODUCTO",id);
    const response = await apiClient.get(`/store/products/${id}`);
    console.log("AQUI LA RESPONSE",response);
    return response.data;
  };

  export const getProductsPage = async (
    page: number,
    size: number,
    category?: string,
    sortBy?: string
  ): Promise<ProductPage> => {
    // Parametrizamos la llamada
    const params: any = {};
    if (category) params.category = category;
    if (sortBy) params.sortBy = sortBy;
    params.size = size;
  
    const response = await apiClient.get(`/store/products/page/${page}`, { params });
    console.log("obtener datos paginacion getProductPage",response);
    return response.data;  
  };
  

  // ProductService.ts (frontend)
export const getProductsBySearch = async (term: string): Promise<Product[]> => {
  const response = await apiClient.get('/store/products/search', {
    params: { term },
  });
  console.log("response",response);
  return response.data; // un array de Product
};

export const createProductPreference = async (items: CartItem[]) => {
 
    // Enviar solicitud POST con los items del carrito
    const response = await apiClient.post('/payment/create_product_preference', items);

    console.log('Preferencia de pago creada:', response.data);
    return response.data;  // Retorna el punto de inicio del checkout (initPoint)
    

};

export const getDistinctBrands = async (): Promise<string[]> => {
  const response = await apiClient.get('/store/products/brands');
  return response.data;
};

export const getDistinctFlavors = async (): Promise<string[]> => {
  const response = await apiClient.get('/store/products/flavors');
  return response.data;
};


export async function advancedSearchProducts(
  payload: AdvancedSearchPayload
): Promise<ProductPage> {
  const {
    page,
    size,
    sortBy,
    category,
    inStock,
    brands,
    flavors,
    minPrice,
    maxPrice,
  } = payload;

  const params: any = {
    page,
    size,
    sortBy,
    minPrice,
    maxPrice,
  };
  if (category) params.category = category;
  if (inStock !== undefined) params.inStock = inStock;
  if (brands && brands.length > 0) params.brands = brands.join(',');
  if (flavors && flavors.length > 0) params.flavors = flavors.join(',');

  const response = await apiClient.get('/store/products/search2', { params });
  console.log("search2 response", response);
  return response.data;
}

export const getAllCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get('/store/categories');
  return response.data;
};

export const createProduct = async (formData: FormData): Promise<Product> => {
  const response = await apiClient.post('/store/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
export const updateProduct = async (id: number, formData: FormData): Promise<Product> => {
  console.log("aqui formData",formData);
  const response = await apiClient.put(`/store/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};



export const deleteProduct = async (id: number): Promise<void> => {
  await apiClient.delete(`/store/products/${id}`);
};








