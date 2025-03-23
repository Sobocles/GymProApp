import { useState, useEffect } from 'react';
import { getClients } from '../services/TrainerService';

interface Client {
  id: number;
  username: string;
  email: string;
  admin: boolean;
  trainer: boolean;
  profileImageUrl: string | null;
}

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const data = await getClients();
        setClients(data);
      } catch (err) {
        setError('Error al cargar los clientes');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  return { clients, loading, error };
};
