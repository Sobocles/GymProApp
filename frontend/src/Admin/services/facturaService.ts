// src/Admin/services/facturaService.ts

import apiClient from "../../Apis/apiConfig";
import { AxiosResponse } from "axios";
// import { PaymentPlanDTO } from "./FinancialService";
import { PaymentPlanDTO, PaymentProductDTO  }from "../../Store/interface/Payment"


export interface FacturasPage {
  content: PaymentProductDTO[];
  totalPages: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface PlanesPage {
  content: PaymentPlanDTO[];
  totalPages: number;
  number: number;
  first: boolean;
  last: boolean;
}

/*
export interface PaymentPlanDTO {
  paymentId: number;
  planId: number;
  username: string;
  transactionAmount: number;
  status: string;
  paymentMethod: string | null;
  paymentDate: string; // o Date
  subscriptionStartDate: string; // "2024-12-07"
  subscriptionEndDate: string;   // "2025-12-07"
  trainerSubscriptionStartDate: string; 
  trainerSubscriptionEndDate: string;
  personalTrainerName: string;
} */

  export const getFacturasPage = async (
    page: number,
    size = 6,
    search = ""
  ): Promise<AxiosResponse<FacturasPage>> => {
    return apiClient.get(`/payment/approved_products/page/${page}`, {
      params: { size, search },
    });
  };
  

  export const getPlanesPage = async (
    page: number,
    size = 6,
    search = ""
  ): Promise<AxiosResponse<PlanesPage>> => {
    return apiClient.get(`/payment/approved_plans/page/${page}`, {
      params: { size, search }, // Agregamos el parámetro de búsqueda
    });
  };
