import privateApi from "../Apis/apiConfig";

export const uploadCarouselImage = async (
  file: File,
  caption: string,
  orderNumber: number
) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('caption', caption);
    formData.append('orderNumber', orderNumber.toString());

    const response = await privateApi.post('/carousel/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error al subir imagen al carrusel:', error);
    throw error;
  }
};


