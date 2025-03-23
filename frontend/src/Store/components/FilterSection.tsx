import React from 'react';
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Checkbox,
  Box,
  styled
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface FilterSectionProps {
  checkBoxInStock: boolean;
  setCheckBoxInStock: React.Dispatch<React.SetStateAction<boolean>>;
  
  selectedBrands: string[];
  setSelectedBrands: React.Dispatch<React.SetStateAction<string[]>>;
  
  selectedFlavors: string[];
  setSelectedFlavors: React.Dispatch<React.SetStateAction<string[]>>;

  brands: string[]; 
  flavors: string[];              // <-- Ahora recibimos flavors dinámicos
}

const StyledAccordion = styled(Accordion)({
  backgroundColor: '#1976d2',
  color: 'white',
  margin: '8px 0',
  borderRadius: '8px',
  '&:before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    margin: '8px 0',
  },
});

const StyledAccordionSummary = styled(AccordionSummary)({
  '& .MuiAccordionSummary-expandIconWrapper': {
    color: 'white',
  },
  '&:hover': {
    backgroundColor: '#1565c0',
  },
});

const StyledCheckbox = styled(Checkbox)({
  color: 'white !important',
  '&.Mui-checked': {
    color: '#ff4081 !important',
  },
});

const FilterSection: React.FC<FilterSectionProps> = ({
  checkBoxInStock,
  setCheckBoxInStock,
  selectedBrands,
  setSelectedBrands,
  selectedFlavors,
  setSelectedFlavors,
  brands,
  flavors, 
}) => {

  const handleInStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckBoxInStock(e.target.checked);
  };

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleFlavorToggle = (flavor: string) => {
    setSelectedFlavors((prev) =>
      prev.includes(flavor) ? prev.filter((f) => f !== flavor) : [...prev, flavor]
    );
  };

  return (
    <Box display="flex" flexDirection="column" gap={1} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ 
        color: '#1976d2',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }}>
        Filtros
      </Typography>

      {/* Disponibilidad */}
      <StyledAccordion>
        <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 500 }}>Disponibilidad</Typography>
        </StyledAccordionSummary>
        <AccordionDetails sx={{ bgcolor: '#f5f5f5' }}>
          <FormControlLabel
            control={
              <StyledCheckbox
                name="inStock"
                checked={checkBoxInStock}
                onChange={handleInStockChange}
              />
            }
            label="En existencia"
            sx={{ color: '#1976d2' }}
          />
        </AccordionDetails>
      </StyledAccordion>

      {/* Marcas */}
      <StyledAccordion>
        <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 500 }}>Marca</Typography>
        </StyledAccordionSummary>
        <AccordionDetails sx={{ bgcolor: '#f5f5f5' }}>
          {brands.map((brand) => (
            <FormControlLabel
              key={brand}
              control={
                <StyledCheckbox
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandToggle(brand)}
                />
              }
              label={brand}
              sx={{ color: '#1976d2', width: '100%', m: 0 }}
            />
          ))}
        </AccordionDetails>
      </StyledAccordion>

      {/* Sabores */}
      <StyledAccordion>
        <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 500 }}>Sabor</Typography>
        </StyledAccordionSummary>
        <AccordionDetails sx={{ bgcolor: '#f5f5f5' }}>
          {flavors.length === 0 ? (
            <Typography variant="body2" sx={{ color: '#1976d2' }}>
              No hay sabores registrados.
            </Typography>
          ) : (
            flavors.map((flavor) => (
              <FormControlLabel
                key={flavor}
                control={
                  <StyledCheckbox
                    checked={selectedFlavors.includes(flavor)}
                    onChange={() => handleFlavorToggle(flavor)}
                  />
                }
                label={flavor}
                sx={{ color: '#1976d2', width: '100%', m: 0 }}
              />
            ))
          )}
        </AccordionDetails>
      </StyledAccordion>
    </Box>
  );
};

export default FilterSection;
