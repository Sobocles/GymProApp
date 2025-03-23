// src/Admin/hooks/useFacturas.ts
import { useState, useEffect } from "react";
import { FacturasPage, getFacturasPage } from "../services/facturaService";
import { PaymentProductDTO } from "../../Store/interface/Payment";

interface PaginatorState {
  number: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export const useFacturas = (currentPage: number, searchTerm: string) => {
  const [facturas, setFacturas] = useState<PaymentProductDTO[]>([]);
  const [paginator, setPaginator] = useState<PaginatorState>({
    number: 0,
    totalPages: 1,
    first: true,
    last: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFacturasPage = async (page: number, search: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Ahora se pasa el parámetro "search" a la función del servicio
      const response = await getFacturasPage(page, 6, search);
      console.log("aqui la informacion de la factura",response);
      const data: FacturasPage = response.data;
      setFacturas(data.content);
      setPaginator({
        number: data.number,
        totalPages: data.totalPages,
        first: data.first,
        last: data.last,
      });
    } catch (err: any) {
      console.error(err);
      setError("Error al obtener las facturas de productos aprobados.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFacturasPage(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  return {
    facturas,
    paginator,
    isLoading,
    error,
    reloadFacturas: fetchFacturasPage, // Por si necesitas recargar manualmente
  };
};
