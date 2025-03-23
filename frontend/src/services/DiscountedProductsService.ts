import apiClient from '../Apis/apiConfig';

export const getDiscountedProducts = async () => {
  try {
    // Ajusta la ruta según tu backend (aquí asumo '/store/products/offers')
    const response = await apiClient.get('/store/products/offers');
    return response.data;
  } catch (error) {
    console.error('Error al obtener productos en oferta:', error);
    throw error;
  }
};

// src/utils/discount.ts
import { Product } from '../Store/interface/Product';

export const getDiscountedPrice = (product: Product) => {
  const now = new Date();
  const start = product.discountStart ? new Date(product.discountStart) : null;
  const end = product.discountEnd ? new Date(product.discountEnd) : null;
  
  let isDiscountActive = false;
  if (
    product.discountPercent && 
    product.discountPercent > 0 && 
    start && 
    end && 
    now >= start && 
    now <= end
  ) {
    isDiscountActive = true;
  }

  const originalPrice = product.price;
  let finalPrice = product.price;
  if (isDiscountActive) {
    finalPrice = finalPrice - (finalPrice * product.discountPercent / 100);
  }

  return { originalPrice, finalPrice, isDiscountActive, discountReason: isDiscountActive ? product.discountReason : null };
};

