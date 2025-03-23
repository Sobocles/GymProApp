/* eslint-disable @typescript-eslint/no-explicit-any */
// src/Admin/hooks/usePlanes.ts
import { useState, useEffect } from "react";
import {  PlanesPage, getPlanesPage } from "../services/facturaService";
import { PaymentPlanDTO } from "../../Store/interface/Payment";

interface PaginatorState {
  number: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export const usePlanes = (currentPage: number, searchTerm: string) => {
  const [planes, setPlanes] = useState<PaymentPlanDTO[]>([]);
  const [paginator, setPaginator] = useState<PaginatorState>({
    number: 0,
    totalPages: 1,
    first: true,
    last: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlanesPage = async (page: number, search: string) => {
    try {
      setIsLoading(true);
      setError(null);


      const response = await getPlanesPage(page, 6, search);
      const data: PlanesPage = response.data;
      setPlanes(data.content);
      setPaginator({
        number: data.number,
        totalPages: data.totalPages,
        first: data.first,
        last: data.last,
      });
    } catch (err: any) {
      console.error(err);
      setError("Error al obtener los pagos aprobados de planes.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanesPage(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  return {
    planes,
    paginator,
    isLoading,
    error,
    reloadPlanes: fetchPlanesPage, 
  };
};
