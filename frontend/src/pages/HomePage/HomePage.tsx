import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Tus imágenes locales
import './HomePage.css';
import img1 from '../../assets/Equipamiento.png';
import img2 from '../../assets/Clases_grupales.png';
import img3 from '../../assets/Personal_Trainer.png';
import img4 from '../../assets/Suplementos.png';
import planImg from '../../assets/t600x362.jpg';
import renuevaImg from '../../assets/smart-fit.jpg';
import semaforoImg from '../../assets/entrenador-personal-madrid.jpg';
import gratisImg from '../../assets/reserva.png';
import { Product } from '../../Store/interface/Product';
// Importamos la función que obtiene los productos en oferta
import { getDiscountedProducts } from '../../services/DiscountedProductsService';


// Función auxiliar para calcular precio final y descuento
function getDiscountedPrice(product: Product) {
  const now = new Date();
  const start = product.discountStart ? new Date(product.discountStart) : null;
  const end = product.discountEnd ? new Date(product.discountEnd) : null;

  let isDiscountActive = false;
  if (
    product.discountPercent > 0 &&
    start && end &&
    now >= start &&
    now <= end
  ) {
    isDiscountActive = true;
  }

  const originalPrice = product.price;
  let finalPrice = product.price;
  if (isDiscountActive) {
    finalPrice = finalPrice - (finalPrice * product.discountPercent / 100);
  }

  return {
    originalPrice,
    finalPrice,
    isDiscountActive,
    discountReason: isDiscountActive ? product.discountReason : null,
  };
}

const HomePage = () => {
  const navigate = useNavigate();
  const [discountedProducts, setDiscountedProducts] = useState<Product[]>([]);

  // Cargar productos en oferta cuando se monta el componente
  useEffect(() => {
    const fetchDiscountedProducts = async () => {
      try {
        const data = await getDiscountedProducts();
        setDiscountedProducts(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDiscountedProducts();
  }, []);

  // Función para navegar según la tarjeta clicada
  const handleFeatureClick = (feature: 'clubes' | 'grupales' | 'planes' | 'tienda') => {
    switch (feature) {
      case 'clubes':
        navigate('/about');
        break;
      case 'grupales':
        navigate('/services');
        break;
      case 'planes':
        navigate('/services');
        break;
      case 'tienda':
        navigate('/store');
        break;
      default:
        break;
    }
  };

  // Nuevo handler al hacer clic en la card de producto
  const handleProductClick = (productId: number) => {
    navigate(`/store/product/${productId}`);
  };

  return (
    <div className="homepage-container">
      <h1>Bienvenido al Gimnasio</h1>

      {/* SECCIÓN DE FEATURES */}
      <div className="features-container">
        <div className="feature-item" onClick={() => handleFeatureClick('clubes')}>
          <img src={img1} alt="Clubes full equipados" />
          <p>CLUBES FULL EQUIPADOS</p>
        </div>
        <div className="feature-item" onClick={() => handleFeatureClick('grupales')}>
          <img src={img2} alt="Clases grupales" />
          <p>CLASES GRUPALES</p>
        </div>
        <div className="feature-item" onClick={() => handleFeatureClick('planes')}>
          <img src={img3} alt="Personal trainer" />
          <p>PLANES DE GIMNASIO + PERSONAL TRAINER</p>
        </div>
        <div className="feature-item" onClick={() => handleFeatureClick('tienda')}>
          <img src={img4} alt="Medicina deportiva" />
          <p>TIENDA DE SUPLEMENTOS</p>
        </div>
      </div>

      {/* SECCIÓN PROMO */}
      <div className="promo-section">
        <h2>SOMOS LOS QUE ENTRENAMOS CON TODO Y CON TOD@S</h2>
        <div className="promo-grid">
          <div className="promo-item">
            <img src={planImg} alt="Planes de gimnasio" />
            <p>PLANES DE GIMNASIO</p>
          </div>
          <div className="promo-item">
            <img src={renuevaImg} alt="Renueva tu plan" />
            <p>OBTEN DESCUENTOS EN SUPLEMENTOS</p>
          </div>
          <div className="promo-item">
            <img src={semaforoImg} alt="Semáforo nutricional" />
            <p>ESCOGE A TU PERSONAL TRAINER</p>
          </div>
          <div className="promo-item">
            <img src={gratisImg} alt="5 días gratis" />
            <p>RESERVA TU HORARIO DE ENTRENAMIENTO</p>
          </div>
        </div>
      </div>

      {/* CARRUSEL DE PRODUCTOS EN OFERTA */}
      <div style={{ margin: '40px auto', maxWidth: '1200px' }}>
        <h2>Productos en Oferta</h2>
        {discountedProducts.length === 0 ? (
          <p>No hay productos en oferta disponibles.</p>
        ) : (
          <Swiper
            modules={[Navigation, Pagination]}
            slidesPerView={3}
            spaceBetween={20}
            navigation
            pagination={{ clickable: true }}
          >
            {discountedProducts.map((product) => {
              const {
                originalPrice,
                finalPrice,
                isDiscountActive,
                discountReason,
              } = getDiscountedPrice(product);

              return (
                <SwiperSlide key={product.id}>
                  <div 
                    className="discount-product-card"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="discount-product-image"
                    />
                    <h3 className="discount-product-name">{product.name}</h3>

                    {isDiscountActive ? (
                      <div className="discount-product-price-section">
                        <p className="original-price">
                          <s>${originalPrice.toFixed(2)}</s>
                        </p>
                        <p className="final-price">${finalPrice.toFixed(2)}</p>
                        {discountReason && (
                          <p className="discount-reason">({discountReason})</p>
                        )}
                      </div>
                    ) : (
                      <div className="discount-product-price-section">
                        <p className="no-discount-price">
                          ${originalPrice.toFixed(2)}
                        </p>
                      </div>
                    )}
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </div>
    </div>
  );
};

export default HomePage;
