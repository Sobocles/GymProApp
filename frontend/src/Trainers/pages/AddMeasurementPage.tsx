import React, { useState } from 'react';
import ClientSelect from '../components/ClientSelect';
import AddMeasurementForm from '../components/forms/AddMeasurementForm';

const AddMeasurementFormWithClient: React.FC = () => {
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);

  const handleClientSelect = (clientId: number) => {
    setSelectedClientId(clientId);
  };

  return (
    <div>
      <h2>Seleccionar Cliente</h2>
      {/* Selector de cliente */}
      <ClientSelect onSelect={handleClientSelect} />

      {/* Mostrar el formulario si hay un cliente seleccionado */}
      {selectedClientId && (
        <div>
          <h3>Cliente Seleccionado: {selectedClientId}</h3>
          <AddMeasurementForm clientId={selectedClientId} />
        </div>
      )}
    </div>
  );
};

export default AddMeasurementFormWithClient;
