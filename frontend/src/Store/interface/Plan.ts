export interface Plan {
    id: number;
    name: string;
    price: number;
    description?: string;
    discount?: number;
    discountReason?: string; 
    versionNumber?: number;
    active?: boolean;
    durationMonths?: number;
  }
  
  