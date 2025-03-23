import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import apiClient from '../../../Apis/apiConfig';
import './PaymentReceipt.css'; // Crear este archivo CSS

// Estructura para almacenar los detalles recibidos de /payment/details
interface PaymentDTO {
  id: number;
  userId: number;
  username: string;
  paymentType: string;
  status: string | null;
  paymentMethod: string | null;
  transactionAmount: number;
  paymentDate: string;  // o Date si lo parseas
  planName?: string;
  subscriptionStartDate?: string; // o Date
  subscriptionEndDate?: string;   // o Date
  products?: ProductDto[];
}

interface ProductDto {
  name: string;
  price: number;
  description: string;
  brand: string;
  flavor: string;
  imageUrl: string;
  // quantity?: number; // si quisieras mostrar cuántos compró
}

const PaymentSuccessPage = () => {
  const location = useLocation();
  const [paymentData, setPaymentData] = useState<PaymentDTO | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paymentId = params.get('payment_id');  
  
    if (paymentId) {
      apiClient
        .get<PaymentDTO>(`/payment/details/mp/${paymentId}`)
        .then((response) => { 
          setPaymentData(response.data); 
        })
        .catch((error) => {
          console.error('Error al obtener detalles de pago:', error);
        });
    }
  }, [location]);
  
  const handlePrint = () => {
    window.print();
  };

  if (!paymentData) return <div>Cargando comprobante...</div>;
  return (
    <div className="receipt-container">
      <button onClick={handlePrint} className="print-button">
        Imprimir Comprobante
      </button>

      <div className="receipt">
        <header className="receipt-header">
          <h1>Comprobante de Pago</h1>
          <div className="company-info">
            <h2>Mi Empresa S.A.C.</h2>
            <p>RUC: 12345678901</p>
            <p>Av. Ejemplo 123, Lima, Perú</p>
            <p>Teléfono: (01) 234-5678</p>
          </div>
        </header>

        <div className="receipt-details">
          <div className="detail-row">
            <span>Fecha:</span>
            <span>{new Date(paymentData.paymentDate).toLocaleDateString()}</span>
          </div>
          <div className="detail-row">
            <span>N° Comprobante:</span>
            <span>{paymentData.id}</span>
          </div>
          <div className="detail-row">
            <span>Cliente:</span>
            <span>{paymentData.username}</span>
          </div>
          <div className="detail-row">
            <span>Método de Pago:</span>
            <span>{paymentData.paymentMethod}</span>
          </div>
          <div className="detail-row">
            <span>Estado:</span>
            <span className="status-success">{paymentData.status}</span>
          </div>
        </div>

        {paymentData.planName && (
          <div className="plan-section">
            <h3>Suscripción al Plan</h3>
            <div className="plan-details">
              <p><strong>Plan:</strong> {paymentData.planName}</p>
              <p><strong>Duración:</strong> Del {paymentData.subscriptionStartDate} al {paymentData.subscriptionEndDate}</p>
            </div>
          </div>
        )}

        {paymentData.products && paymentData.products.length > 0 && (
          <div className="products-section">
            <h3>Productos Adquiridos</h3>
            <table className="products-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Descripción</th>
                  <th>Precio</th>
                </tr>
              </thead>
              <tbody>
                {paymentData.products.map((prod, idx) => (
                  <tr key={idx}>
                    <td>{prod.name}</td>
                    <td>{prod.description} - {prod.brand} ({prod.flavor})</td>
                    <td>S/ {prod.price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="total-section">
          <div className="total-row">
            <span>TOTAL PAGADO:</span>
            <span>S/ {paymentData.transactionAmount.toFixed(2)}</span>
          </div>
        </div>

        <footer className="receipt-footer">
          <p>¡Gracias por su compra!</p>
          <p>Para consultas o devoluciones, contactar a: soporte@miempresa.com</p>
          <p>Este comprobante es válido como factura electrónica</p>
        </footer>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
