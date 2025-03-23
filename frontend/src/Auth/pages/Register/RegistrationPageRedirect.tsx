// src/Auth/pages/Register/RegistrationPageRedirect.tsx

import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { RegistrationPage } from '../Register/RegisterPage';

const RegistrationPageRedirect = () => {
  const { isAuth } = useSelector((state: RootState) => state.auth);
  return isAuth ? <Navigate to="/admin/users" /> : <RegistrationPage />;
};

export default RegistrationPageRedirect;
