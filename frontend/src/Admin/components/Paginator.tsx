import React from 'react';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';

interface PaginatorProps {
  url: string;
  paginator: {
    number: number;
    totalPages: number;
    first: boolean;
    last: boolean;
  };
  sortBy?: string; // <-- la interrogación indica que es opcional
}


export const Paginator = ({ url, paginator, sortBy }: PaginatorProps) => {



  

  const { number, totalPages, first, last } = paginator;

  
  

  if (totalPages <= 1) return null;

  return (
    <Box
      component="nav"
      sx={{
        position: 'sticky',
        bottom: 0,
        width: '100%',
        backgroundColor: '#fff',
        padding: '10px 0',
        boxShadow: '0 -2px 5px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ul className="pagination" style={{ display: 'flex', listStyle: 'none', padding: 0 }}>
        
        {/* Botón Anterior */}
        {!first && (
          <li className="page-item" style={{ margin: '0 5px' }}>
           <Link to={`${url}/page/${paginator.number - 1}`}>Anterior</Link>
          </li>
        )}

        {/* Números de página */}
        {Array.from(Array(totalPages).keys()).map((pageIndex) => (
          <li
            key={pageIndex}
            className={`page-item ${number === pageIndex ? 'active' : ''}`}
            style={{ margin: '0 5px' }}
          >
            <Link
              className="page-link"
              to={`${url}/page/${pageIndex}${sortBy ? `?sortBy=${sortBy}` : ''}`} >
        
              {pageIndex + 1}
            </Link>
          </li>
        ))}

        {/* Botón Siguiente */}
        {!last && (
          <li className="page-item" style={{ margin: '0 5px' }}>
            <Link to={`${url}/page/${paginator.number + 1}`}>Siguiente</Link>
          </li>
        )}
      </ul>
    </Box>
  );
};
