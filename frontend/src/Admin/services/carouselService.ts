import apiClient from '../../Apis/apiConfig';

// Obtener todas las imágenes del carrusel
export const getCarouselImages = async () => {
  try {
    const response = await apiClient.get('/carousel/images');
    return response.data;
  } catch (error) {
    console.error('Error al obtener imágenes del carrusel:', error);
    throw error;
  }
};

// Subir una nueva imagen al carrusel
export const uploadCarouselImage = async (
  file: File,
  caption: string,
  orderNumber: number
) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('caption', caption);
  formData.append('order', orderNumber.toString());

  try {
    const response = await apiClient.post('/carousel/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al subir la imagen del carrusel:', error);
    throw error;
  }
};

// Actualizar una imagen existente - versión actualizada para aceptar FormData
export const updateCarouselImage = async (
  id: number,
  formData: FormData
) => {
  try {
    const response = await apiClient.put(`/carousel/images/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log("response", response);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar la imagen:', error);
    throw error;
  }
};

// Conservamos también la versión anterior para mantener compatibilidad
export const updateCarouselImageLegacy = async (
  id: number,
  caption?: string,
  orderNumber?: number
) => {
  console.log(id, caption, orderNumber);
  const formData = new FormData();
  if (caption) formData.append('caption', caption);
  if (orderNumber !== undefined) formData.append('order', orderNumber.toString());

  try {
    const response = await apiClient.put(`/carousel/images/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log("response", response);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar la imagen:', error);
    throw error;
  }
};

// Eliminar una imagen del carrusel
export const deleteCarouselImage = async (id: number) => {
  try {
    await apiClient.delete(`/carousel/images/${id}`);
  } catch (error) {
    console.error('Error al eliminar la imagen del carrusel:', error);
    throw error;
  }
};