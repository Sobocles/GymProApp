import { useEffect, useState } from 'react';

/**
 * Recibe un string con la fecha/hora de fin de oferta (ej: "2025-01-31T23:59:59")
 * Retorna la cadena de texto con "Xh Ym Zs" restante, o "¡Terminó!" si ya llegó a 0.
 */
export function useCountdown(discountEnd: string | undefined) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!discountEnd) {
      setTimeLeft('');
      return;
    }

    const endDate = new Date(discountEnd).getTime();

    function updateCountdown() {
      const now = new Date().getTime();
      const diff = endDate - now;

      if (diff <= 0) {
        setTimeLeft('¡Terminó!');
        return;
      }

      // Calculamos horas, minutos y segundos
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }

    // Lanzamos la actualización de inmediato
    updateCountdown();

    // Actualizamos cada segundo
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [discountEnd]);

  return timeLeft;
}
