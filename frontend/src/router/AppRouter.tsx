// src/router/AppRouter.tsx
import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import MainLayout from '../components/layout/MainLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import GymInfoForm from '../Admin/pages/GymInfoForm';



// Páginas públicas - Lazy load
const HomePage = lazy(() => import('../pages/HomePage/HomePage'));
const AboutUsPage = lazy(() => import('../pages/AboutUsPage/AboutUsPage'));
const ServicesPage = lazy(() => import('../pages/ServicePage/ServicePage'));
const LoginPage = lazy(() => import('../Auth/pages').then(module => ({ default: module.LoginPage })));
const RegistrationPageRedirect = lazy(() => import('../Auth/pages/Register/RegistrationPageRedirect'));
const PaymentSuccessPage = lazy(() => import('../Users/pages/mercadoPago/PaymentSuccessPage'));
const PersonalTrainerPage = lazy(() => import('../pages/personalTrainer/PersonalTrainer'));
const StoreHomePage = lazy(() => import('../Store/pages/StoreHomePage'));
const ProteinaPage = lazy(() => import('../Store/pages/ProteinaPage'));
const CreatinaPage = lazy(() => import('../Store/pages/CreatinaPage'));
const ProductDetailPage = lazy(() => import('../Store/pages/ProductDetailPage'));
const CartPage = lazy(() => import('../Store/pages/CartPage'));

// Páginas protegidas - Lazy load
const UserDashboard = lazy(() => import('../Users/pages/UserDashboard').then(module => ({ default: module.UserDashboard })));
const DashboardAdmin = lazy(() => import('../Admin/pages/AdminDashBoardPage'));
const UsersPage = lazy(() => import('../Admin/pages/userPage').then(module => ({ default: module.UsersPage })));
const TrainerDashboard = lazy(() => import('../Trainers/pages/TrainerDashboard'));
const CarouselAdminPage = lazy(() => import('../Admin/pages/CarouselAdminPage'));
const TrainerProfileEditPage = lazy(() => import('../Trainers/pages/TrainerProfileEditPage').then(module => ({ default: module.TrainerProfileEditPage })));
const TrainerCalendarPage = lazy(() => import('../Trainers/pages/TrainerCalendarPage'));
const AssignTrainerAvailabilityPage = lazy(() => import('../Admin/pages/AdminTrainerAvailabilityForm'));
const AddMeasurementPage = lazy(() => import('../Trainers/pages/AddMeasurementPage'));
const AddRoutinePage = lazy(() => import('../Trainers/pages/AddRoutinePage'));
const MeasurementsPage = lazy(() => import('../Users/pages/MeasurementsPage'));
const GroupClassesCreatePage = lazy(() => import('../Admin/pages/GroupClassesCreatePage').then(module => ({ default: module.GroupClassesCreatePage })));
const GroupClassesAssignTrainerPage = lazy(() => import('../Admin/hooks/GroupClassesAssignTrainerPage').then(module => ({ default: module.GroupClassesAssignTrainerPage })));

const TrainerCalendar = lazy(() => import('../components/Trainer-Calendar/TrainerCalendar'));
const TrainerSessionsCalendar = lazy(() => import('../Users/components/TrainerSessionsCalendar'));
const CategoryCrud = lazy(() => import('../Admin/pages/CategoryCrud').then(module => ({ default: module.CategoryCrud })));
const ProductCrud = lazy(() => import('../Admin/pages/ProductCrud').then(module => ({ default: module.ProductCrud })));

const AdminPlanCrudPage = lazy(() => import('../Admin/pages/AdminPlanCrudPage'));
const PaymentFailurePage = lazy(() => import('../Users/pages/mercadoPago/PaymentPendingPage'));
const AdminFacturasPage = lazy(() => import('../Admin/pages/AdminFacturasPage'));
const AdminPlanesPage = lazy(() => import('../Admin/pages/AdminPlanesPage'));

export const AppRouter = () => {
  const { isAuth } = useSelector((state: RootState) => state.auth);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Rutas públicas */}
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutUsPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="auth/login" element={<LoginPage />} />
          <Route path="auth/register" element={<RegistrationPageRedirect />} />
          <Route path="success" element={<PaymentSuccessPage />} />
          <Route path="failure" element={<PaymentFailurePage />} />
          <Route path="personal-trainer" element={<PersonalTrainerPage />} />
          <Route path="store" element={<StoreHomePage />} />
          <Route path="store/page/:page" element={<StoreHomePage />} />
          <Route path="store/proteina" element={<ProteinaPage />} />
          <Route path="store/creatina" element={<CreatinaPage />} />
          <Route path="store/product/:id" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />

          {/* Rutas protegidas */}
          <Route path="dashboard" element={isAuth ? <UserDashboard /> : <Navigate to="/auth/login" />} />
          <Route path="admin/dashboard" element={isAuth ? <DashboardAdmin /> : <Navigate to="/auth/login" />} />
          <Route 
          path="admin/users/page/:page" 
          element={isAuth ? <UsersPage /> : <Navigate to="/auth/login" />} 
        />
            <Route
            path="admin/gym-info"
            element={isAuth ? <GymInfoForm /> : <Navigate to="/auth/login" />}
          />
        // Redirección desde ruta base
        <Route 
          path="admin/users" 
          element={<Navigate to="/admin/users/page/0" replace />} 
        />
          <Route path="admin/carousel" element={isAuth ? <CarouselAdminPage /> : <Navigate to="/auth/login" />} />
          <Route path="admin/group-classes/create" element={isAuth ? <GroupClassesCreatePage /> : <Navigate to="/auth/login" />} />
          <Route path="admin/group-classes/assign-trainer" element={isAuth ? <GroupClassesAssignTrainerPage /> : <Navigate to="/auth/login" />} />
          <Route path="admin/trainer-availability" element={isAuth ? <AssignTrainerAvailabilityPage /> : <Navigate to="/auth/login" />} />
          <Route path="admin/store/categories" element={isAuth ? <CategoryCrud /> : <Navigate to="/auth/login" />} />


          <Route path="admin/store/products/page/:page" element={isAuth ? <ProductCrud /> : <Navigate to="/auth/login" />} />

          <Route path="admin/store/products" element={isAuth ? <ProductCrud /> : <Navigate to="/auth/login" />} />

          <Route path="admin/plans" element={isAuth ? <AdminPlanCrudPage /> : <Navigate to="/auth/login" />} />
          <Route path="admin/facturas/page/:page" element={isAuth ? <AdminFacturasPage /> : <Navigate to="/auth/login" />} />
          <Route 
          path="admin/planes/page/:page" 
          element={isAuth ? <AdminPlanesPage /> : <Navigate to="/auth/login" />} />


        <Route 
          path="admin/planes" 
          element={<Navigate to="/admin/planes/page/0" replace />} 
        />

        <Route 
          path="trainers/dashboard" 
          element={isAuth ? <TrainerDashboard /> : <Navigate to="/auth/login" />} 
        />
                  <Route 
          path="trainers/edit-profile" 
          element={isAuth ? <TrainerProfileEditPage /> : <Navigate to="/auth/login" />} 
        />
                  <Route path="trainer/calendar" element={isAuth ? <TrainerCalendarPage /> : <Navigate to="/auth/login" />} />
                  <Route 
          path="trainers/clients/:clientId/measurements/add" // ✅ Ruta dinámica
          element={isAuth ? <AddMeasurementPage /> : <Navigate to="/auth/login" />} 
        />
                  <Route path="trainer/add-routine" element={isAuth ? <AddRoutinePage /> : <Navigate to="/auth/login" />} />

                  <Route 
          path="users/measurements" 
          element={isAuth ? <MeasurementsPage /> : <Navigate to="/auth/login" />} 
        />

                  <Route path="dashboard/trainer-sessions" element={isAuth ? <TrainerSessionsCalendar /> : <Navigate to="/auth/login" />} />

                  <Route 
          path="dashboard/calendar" 
          element={isAuth ? <TrainerSessionsCalendar /> : <Navigate to="/auth/login" />} 
        />

<Route
  path="trainers/my-calendar"
  element={isAuth ? <TrainerCalendar /> : <Navigate to="/auth/login" />}
/>



          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </Suspense>
  );
};