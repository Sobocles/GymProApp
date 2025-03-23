import React from 'react';
import AdminTrainerAvailabilityForm from '../components/forms/AdminTrainerAvailabilityForm';

const AssignTrainerAvailabilityPage: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Asignar Horarios a Entrenador</h2>
      <AdminTrainerAvailabilityForm />
    </div>
  );
};

export default AssignTrainerAvailabilityPage;
