
import { Select, MenuItem, CircularProgress, Typography } from '@mui/material';
import { useClients } from '../hooks/useClients';




const ClientSelect: React.FC<{ onSelect: (clientId: number) => void }> = ({ onSelect }) => {
    const { clients, loading, error } = useClients();
  
    if (loading) {
      return <CircularProgress />;
    }
  
    if (error) {
      return <Typography color="error">{error}</Typography>;
    }
  
    return (
      <Select fullWidth defaultValue="" onChange={(e) => onSelect(Number(e.target.value))}>
        <MenuItem value="" disabled>
          Selecciona un cliente
        </MenuItem>
        {clients.map((client) => (
          <MenuItem key={client.id} value={client.id}>
            {client.username} ({client.email})
          </MenuItem>
        ))}
      </Select>
    );
  };
  
  export default ClientSelect;
