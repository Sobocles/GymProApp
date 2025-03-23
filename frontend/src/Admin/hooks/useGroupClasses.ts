// src/hooks/useGroupClasses.ts
import { useState } from 'react';
import { createGroupClass, assignTrainerToClass, CreateGroupClassData } from '../services/groupClassService';

export const useGroupClasses = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateClass = async (data: CreateGroupClassData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await createGroupClass(data);
      return result;
    } catch (err: any) {
      setError(err.message || 'Error al crear la clase grupal');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTrainer = async (classId: number, trainerId: number) => {
    try {
      setLoading(true);
      setError(null);
      const result = await assignTrainerToClass(classId, trainerId);
      return result;
    } catch (err: any) {
      setError(err.message || 'Error al asignar entrenador');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    handleCreateClass,
    handleAssignTrainer
  };
};
