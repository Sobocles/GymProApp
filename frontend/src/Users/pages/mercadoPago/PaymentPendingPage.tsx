import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface PaymentDetails {
  paymentId: string | null;
  status: string | null;
  externalReference: string | null;
}

const PaymentFailurePage = () => {
  const location = useLocation();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paymentId = params.get('payment_id');
    const status = params.get('status');
    const externalReference = params.get('external_reference');

    setPaymentDetails({
      paymentId,
      status,
      externalReference,
    });
  }, [location]);

  return (
    <div>
      <h1>¡Pago Fallido!</h1>
      {paymentDetails && (
        <div>
          <p>ID de Pago: {paymentDetails.paymentId}</p>
          <p>Estado: {paymentDetails.status}</p>
          <p>Referencia Externa: {paymentDetails.externalReference}</p>
          <p>Lo sentimos, tu transacción no se pudo completar.</p>
          {/* Aquí podrías mostrar opciones para reintentar el pago, ir al carrito, etc. */}
        </div>
      )}
    </div>
  );
};

export default PaymentFailurePage;
