import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getCarouselImages } from '../services/getCarouselImages';

// Definimos el estado inicial del slice
interface CarouselState {
  images: Array<{
    id: number;
    imageUrl: string;
    caption: string;
    orderNumber: number;
  }>;
  loading: boolean;
  error: string | null;
}

// Estado inicial
const initialState: CarouselState = {
  images: [],
  loading: false,
  error: null,
};

// Creamos una thunk asincrónica que haga la petición al backend
export const fetchCarouselImages = createAsyncThunk(
  'carousel/fetchImages',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getCarouselImages();  // Petición a tu backend
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Creamos el slice
export const carouselSlice = createSlice({
  name: 'carousel',
  initialState,
  reducers: {
    // Si deseas algún reducer extra, puedes ponerlo aquí.
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCarouselImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCarouselImages.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.error = null;
        state.images = action.payload; // Guardamos las imágenes
      })
      .addCase(fetchCarouselImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error al cargar imágenes';
      });
  },
});

export default carouselSlice.reducer;
