// src/components/layout/PublicLayout.tsx

import { Outlet } from 'react-router-dom';
import Header from '../layout/Header/Header';
import Footer from '../layout/Footer/Footer';

const PublicLayout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default PublicLayout;
