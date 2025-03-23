// src/Auth/pages/Login/LoginPage.tsx

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import { Link, useLocation } from 'react-router-dom';
import './LoginPage.css';

export const LoginPage = () => {
  const { handlerLogin } = useAuth();
  const location = useLocation();

  // Obtenemos la ruta de origen, si existe
  const from = location.state?.from || null;

  const formik = useFormik({
    initialValues: {
      loginEmail: '',
      loginPassword: '',
    },
    validationSchema: Yup.object({
      loginEmail: Yup.string()
        .email('Correo electrónico no válido')
        .required('Requerido'),
      loginPassword: Yup.string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .required('Requerido'),
    }),
    onSubmit: async (values) => {
      await handlerLogin(
        {
          email: values.loginEmail,
          password: values.loginPassword,
        },
        from // Pasamos 'from' a 'handlerLogin'
      );
    },
  });

  return (
    <div className="container login-container">
      <div className="row">
        <div className="col-md-6 login-form-1">
          <h3>Ingreso</h3>
          <form onSubmit={formik.handleSubmit}>
            <div className="form-group mb-2">
              <input
                type="text"
                className={`form-control ${formik.touched.loginEmail && formik.errors.loginEmail ? 'is-invalid' : ''
                  }`}
                placeholder="Correo"
                {...formik.getFieldProps('loginEmail')}
              />
              {formik.touched.loginEmail && formik.errors.loginEmail && (
                <div className="invalid-feedback">{formik.errors.loginEmail}</div>
              )}
            </div>

            <div className="form-group mb-2">
              <input
                type="password"
                className={`form-control ${formik.touched.loginPassword && formik.errors.loginPassword ? 'is-invalid' : ''
                  }`}
                placeholder="Contraseña"
                {...formik.getFieldProps('loginPassword')}
              />
              {formik.touched.loginPassword && formik.errors.loginPassword && (
                <div className="invalid-feedback">{formik.errors.loginPassword}</div>
              )}
            </div>

            <div className="d-grid gap-2">
              <input
                type="submit"
                className="btnSubmit"
                value="Login"
              />
            </div>
            <div className="form-group mt-2 text-center">
              <span>¿No tienes una cuenta? </span>
              <Link to="/auth/register">Regístrate aquí</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
