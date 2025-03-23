import apiClient from '../../Apis/apiConfig';

export const getTotalRevenue = async (): Promise<number> => {
  const response = await apiClient.get('/payment/total-revenue');
  // La respuesta tiene la forma { "totalRevenue": 7795000.00 }
  return response.data.totalRevenue;
};

export interface PlanRevenue {
  [planName: string]: number;
}

export interface ServiceRevenue {
  personalTrainer: number;
  planAndTrainer: number;
  plan: number;
}

export interface AdminDashboardRevenue {
  planRevenue: PlanRevenue;
  serviceRevenue: ServiceRevenue;
}

export const getAdminDashboardRevenue = async (): Promise<AdminDashboardRevenue> => {
  const response = await apiClient.get('/payment/admin-dashboard-revenue');
  // Estructura:
  // {
  //   "planRevenue": {
  //       "Trimestral": 230000.00,
  //       "mensual": 475000.00,
  //       "anual": 800000.00
  //   },
  //   "serviceRevenue": {
  //       "personalTrainer": 1060000.00,
  //       "planAndTrainer": 6075000.00,
  //       "plan": 85000.00
  //   }
  // }
  return response.data;
};
