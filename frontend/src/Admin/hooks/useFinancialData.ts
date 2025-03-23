import { useEffect, useState } from 'react';
import { getTotalRevenue, getAdminDashboardRevenue, AdminDashboardRevenue } from '../services/FinancialService';

export const useFinancialData = () => {
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null);
  const [adminRevenueData, setAdminRevenueData] = useState<AdminDashboardRevenue | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [total, adminData] = await Promise.all([
          getTotalRevenue(),
          getAdminDashboardRevenue()
        ]);

        setTotalRevenue(total);
        setAdminRevenueData(adminData);
      } catch (err: any) {
        console.error('Error fetching financial data:', err);
        setError('Error fetching financial data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    totalRevenue,
    adminRevenueData,
    loading,
    error
  };
};
