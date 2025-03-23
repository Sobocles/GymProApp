/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './RegisterPage.css';
import { register } from '../../services/authService';

export const RegistrationPage = () => {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            username: Yup.string()
                .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
                .required('Requerido'),
            email: Yup.string()
                .email('Correo electrónico no válido')
                .required('Requerido'),
            password: Yup.string()
                .min(6, 'La contraseña debe tener al menos 6 caracteres')
                .required('Requerido'),
            // Puedes agregar validación para confirmPassword si lo necesitas
        }),
        onSubmit: async (values) => {
            try {
                await registerUser({
                    username: values.username,
                    email: values.email,
                    password: values.password,
                });

               
                Swal.fire({
                    icon: 'success',
                    title: 'Registro exitoso',
                    text: 'Tu cuenta ha sido creada correctamente.',
                    confirmButtonText: 'Continuar'
                }).then(() => {
                    navigate('/auth/login');
                });
            } catch (error: any) {
               
                if (error.response && error.response.data && error.response.data.message) {
                    const errorMessage: string = error.response.data.message;
                    // Validación para correo duplicado
                    if(errorMessage === 'El correo electrónico ya está en uso'){
                        Swal.fire({
                            icon: 'error',
                            title: 'Correo ya registrado',
                            text: 'El correo electrónico que ingresaste ya está en uso. Por favor, usa otro correo.'
                        });
                    } else if(errorMessage === 'El nombre de usuario ya está en uso'){
                        Swal.fire({
                            icon: 'error',
                            title: 'Nombre de usuario en uso',
                            text: 'El nombre de usuario que ingresaste ya está en uso. Por favor, escoge otro.'
                        });
                    } else {
                        // Si es otro error, mostramos el mensaje devuelto por el backend
                        Swal.fire({
                            icon: 'error',
                            title: 'Error al registrar',
                            text: errorMessage,
                        });
                    }
                } else {
                    // En caso de error inesperado sin estructura definida
                    Swal.fire({
                        icon: 'error',
                        title: 'Error inesperado',
                        text: 'Ocurrió un error, por favor intenta nuevamente.'
                    });
                }
            }
        }
    });

    return (
        <div className="container login-container">
            <div className="row">
                <div className="col-md-6 login-form-1">
                    <h3>Registro</h3>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="form-group mb-2">
                            <input
                                type="text"
                                className={`form-control ${formik.touched.username && formik.errors.username ? 'is-invalid' : ''}`}
                                placeholder="Nombre de usuario"
                                {...formik.getFieldProps('username')}
                            />
                            {formik.touched.username && formik.errors.username && (
                                <div className="invalid-feedback">{formik.errors.username}</div>
                            )}
                        </div>

                        <div className="form-group mb-2">
                            <input
                                type="email"
                                className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                                placeholder="Correo electrónico"
                                {...formik.getFieldProps('email')}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <div className="invalid-feedback">{formik.errors.email}</div>
                            )}
                        </div>

                        <div className="form-group mb-2">
                            <input
                                type="password"
                                className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                                placeholder="Contraseña"
                                {...formik.getFieldProps('password')}
                            />
                            {formik.touched.password && formik.errors.password && (
                                <div className="invalid-feedback">{formik.errors.password}</div>
                            )}
                        </div>

                        {/* Aquí podrías agregar el input de confirmPassword si lo requieres */}

                        <div className="d-grid gap-2">
                            <input
                                type="submit"
                                className="btnSubmit"
                                value="Registrar"
                            />
                        </div>
                        <div className="form-group mt-2 text-center">
                            <span>¿Ya tienes una cuenta? </span>
                            <Link to="/auth/login">Inicia sesión aquí</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
