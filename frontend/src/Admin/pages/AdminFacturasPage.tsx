// src/Admin/pages/AdminFacturasPage.tsx

import React from "react";
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useFacturas } from "../hooks/useFacturas";
import { Paginator } from "../components/Paginator"; 
import { useSearch } from "../hooks/useSearch";

// Si ya tienes un componente de barra de búsqueda tipo "SearchBar"
import SearchBar from "../../components/common/SearchBar";

const AdminFacturasPage: React.FC = () => {
  // Lee el número de página de la URL
  const { page: pageParam } = useParams();
  const currentPage = parseInt(pageParam ?? "0", 10);

    // Hook de búsqueda reutilizable
    const { searchTerm, setSearchTerm } = useSearch();

  // Usa el hook para cargar facturas (paginadas)
  const { facturas, paginator, isLoading, error } = useFacturas(currentPage, searchTerm);





  if (isLoading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
        <Typography variant="h6" mt={2}>
          Cargando pagos aprobados...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        {error}
      </Alert>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Facturas de Productos Aprobados
      </Typography>

      {/* Barra de Búsqueda */}
      <SearchBar
        placeholder="Buscar por usuario, producto, etc."
        value={searchTerm}
        onChange={setSearchTerm}
      />

{facturas.length === 0 ? (
  <Typography variant="h6" sx={{ mt: 2 }}>
    {searchTerm
      ? "No se encontraron resultados para tu búsqueda."
      : "No hay facturas disponibles."}
  </Typography>
) : (
  <TableContainer component={Paper} sx={{ mt: 2 }}>
    <Table aria-label="facturas de productos">
      <TableHead>
        <TableRow>
          <TableCell>ID del Pago</TableCell>
          <TableCell>Usuario</TableCell>
          <TableCell>Método de Pago</TableCell>
          <TableCell>Fecha de Pago</TableCell>
          <TableCell>Monto</TableCell>
          <TableCell>Producto</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {facturas.map((payment) => (
          <TableRow key={payment.paymentId}>
            <TableCell>{payment.paymentId}</TableCell>
            <TableCell>{payment.username}</TableCell>
            <TableCell>{payment.paymentMethod}</TableCell>
            <TableCell>
              {new Date(payment.paymentDate).toLocaleString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </TableCell>
            <TableCell>${payment.transactionAmount.toFixed(2)}</TableCell>
            <TableCell>{payment.productName}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
)}
      {/* 
        Mostrar paginador SOLAMENTE si NO hay término de búsqueda
        y si hay más de una página en total
      */}
      {searchTerm === "" && (
        <Paginator
          url="/admin/facturas"
          paginator={{
            number: paginator.number,
            totalPages: paginator.totalPages,
            first: paginator.first,
            last: paginator.last,
          }}
        />
      )}
    </div>
  );
};

export default AdminFacturasPage;
