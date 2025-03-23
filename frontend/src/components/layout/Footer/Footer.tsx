// Footer.tsx
import React, { useEffect, useState } from 'react';
import './Footer.css';
import { FaInstagram, FaFacebookF, FaWhatsapp, FaTwitter } from 'react-icons/fa';
import { getGymInfo } from '../../../Admin/services/gymInfoService';
import { GymInfoValues } from '../../../Admin/pages/GymInfoForm';

const Footer = () => {
  const [gymInfo, setGymInfo] = useState<GymInfoValues | null>(null);

  useEffect(() => {
    const fetchGymData = async () => {
      try {
        const data = await getGymInfo();
        console.log("aqui la data del gym",data);
        setGymInfo(data);
      } catch (error) {
        console.error('Error fetching gym info:', error);
      }
    };
    
    fetchGymData();
  }, []);

  // Mientras se carga la info, se puede mostrar un loading o usar valores por defecto
  const defaultGymInfo: GymInfoValues = {
    gymName: 'Nuestro Gimnasio',
    address: 'Dirección no disponible',
    phone: '',
    email: '',
    instagram: '',
    facebook: '',
    whatsapp: '',
    twitter: ''
  };

  const info = gymInfo || defaultGymInfo;

  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section about">
          <h2>{info.gymName}</h2>
          <p>{info.address ? `📍 ${info.address}` : 'Entrena con los mejores equipos y profesionales'}</p>
        </div>
        
        <div className="footer-section contact">
          <h3>Contacto</h3>
          {info.phone && <p><strong>Teléfono:</strong> {info.phone}</p>}
          {info.email && (
            <p>
              <strong>Email:</strong>{' '}
              <a href={`mailto:${info.email}`} style={{ color: 'white' }}>
                {info.email}
              </a>
            </p>
          )}
        </div>

        <div className="footer-section social">
          <h3>Síguenos</h3>
          <div className="social-links">
            {info.instagram && (
              <a href={info.instagram} target="_blank" rel="noopener noreferrer">
                <FaInstagram /> Instagram
              </a>
            )}
            
            {info.facebook && (
              <a href={info.facebook} target="_blank" rel="noopener noreferrer">
                <FaFacebookF /> Facebook
              </a>
            )}
            
            {info.whatsapp && (
              <a href={info.whatsapp} target="_blank" rel="noopener noreferrer">
                <FaWhatsapp /> WhatsApp
              </a>
            )}
            
            {info.twitter && (
              <a href={info.twitter} target="_blank" rel="noopener noreferrer">
                <FaTwitter /> Twitter
              </a>
            )}
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} {info.gymName}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
