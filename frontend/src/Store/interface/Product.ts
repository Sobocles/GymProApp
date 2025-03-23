export interface Product {
  id?: number;
  name: string;
  description?: string;
  imageUrl?: string;
  price: number;
  category: {
    id: number;
    name: string;
  };
  stock: number;
  flavor: string;
  brand: string;
  discountPercent: number;
  discountReason: string;
  discountStart?: string; // Agregar si es necesario
  discountEnd?: string;   // Agregar si es necesario
}




