// src/interfaces/Payment.ts

export interface PaymentPlanDTO {
    paymentId: number;
    planId: number;
    username: string;
    transactionAmount: number;
    status: string;
    paymentMethod: string | null;
    paymentDate: string;
    subscriptionStartDate: string;
    subscriptionEndDate: string;
    trainerSubscriptionStartDate: string;
    trainerSubscriptionEndDate: string;
    personalTrainerName: string | null;
  }
  
  export interface PaymentProductDTO {
    paymentId: number;
    username: string;
    paymentMethod: string | null;
    paymentDate: string;
    transactionAmount: number;
    productName: string;
  }
  