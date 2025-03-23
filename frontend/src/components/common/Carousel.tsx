import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { Navigation } from 'swiper/modules';
import { Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { getCarouselImages } from '../../services/getCarouselImages';
import './Carousel.css';

interface Image {
  id: number;
  imageUrl: string;
  caption: string;
  orderNumber: number;
}

const Carousel = () => {
  const [images, setImages] = useState<Image[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await getCarouselImages();
        console.log('Datos recibidos del backend:', data);
        setImages(data);
      } catch (error) {
        console.error('Error al obtener imágenes del carrusel:', error);
      }
    };

    fetchImages();
  }, []);

  return (
    <Swiper
      modules={[Pagination, Navigation, Autoplay]}
      spaceBetween={50}
      slidesPerView={1}
      pagination={{ clickable: true }}
      navigation
      autoplay={{ delay: 6000 }}
    >
      {images.length > 0 ? (
  images.map((image) => (
    <SwiperSlide key={image.id}>
      {!image.imageUrl ? (
        <div style={{ width: '100%', height: '200px', backgroundColor: '#ccc' }}>
          {/* Placeholder */}
        </div>
      ) : (
        <img className="carousel-image" src={image.imageUrl} alt={image.caption} />
      )}
    </SwiperSlide>
  ))
) : (
  <p>No hay imágenes disponibles.</p>
)}

    </Swiper>
  );
};

export default Carousel;
