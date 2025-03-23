// src/Admin/components/UserRow.tsx
import { useUsers } from "../hooks/useUsers";
import { useAuth } from "../../Auth/hooks/useAuth";
import { UserInterface } from '../../Auth/Interfaces/UserInterface';
import { TableRow, TableCell, Button, Avatar, CircularProgress, Chip } from '@mui/material';

interface UserRowProps extends UserInterface {
  isDeleting?: boolean;
}

export const UserRow = ({ id, username, email, admin, trainer, profileImageUrl, roles, isDeleting }: UserRowProps) => {
    const { handlerUserSelectedForm, handlerRemoveUser } = useUsers();
    const { login } = useAuth();

    // Función para renderizar chips de roles
    const renderRoles = () => {
      const roleLabels = [];
      if (admin) roleLabels.push(<Chip key="admin" label="Admin" color="primary" size="small" sx={{ mr: 0.5 }} />);
      if (trainer) roleLabels.push(<Chip key="trainer" label="Entrenador" color="secondary" size="small" sx={{ mr: 0.5 }} />);
      
      // Si no hay roles específicos, mostrar "Usuario"
      if (roleLabels.length === 0) {
        roleLabels.push(<Chip key="user" label="Usuario" color="default" size="small" />);
      }
      
      return roleLabels;
    };

    return (
        <TableRow>
            <TableCell>
                <Avatar
                  alt={username}
                  src={profileImageUrl}
                  sx={{ width: 60, height: 60 }}
                />
            </TableCell>
            <TableCell>{id}</TableCell>
            <TableCell>{username}</TableCell>
            <TableCell>{email}</TableCell>
            <TableCell>{renderRoles()}</TableCell>
            {login.isAdmin && (
                <>
                    <TableCell>
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => handlerUserSelectedForm({
                                id,
                                username,
                                email,
                                admin,
                                trainer,
                                profileImageUrl,
                                roles
                            })}
                            disabled={isDeleting === true} // Solo deshabilitar si isDeleting es exactamente true
                        >
                            Editar
                        </Button>
                    </TableCell>
                    <TableCell>
                        <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => id && handlerRemoveUser(id)}
                            disabled={isDeleting === true} // Solo deshabilitar si isDeleting es exactamente true
                            sx={{ position: 'relative', minWidth: '90px' }}
                        >
                            {isDeleting === true ? (
                                <>
                                    <CircularProgress
                                        size={24}
                                        sx={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            marginTop: '-12px',
                                            marginLeft: '-12px',
                                        }}
                                    />
                                    <span style={{ visibility: 'hidden' }}>Eliminar</span>
                                </>
                            ) : (
                                'Eliminar'
                            )}
                        </Button>
                    </TableCell>
                </>
            )}
        </TableRow>
    );
};