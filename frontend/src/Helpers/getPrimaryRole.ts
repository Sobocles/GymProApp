

export const getPrimaryRole = (roles: string[]): string => {
    const rolePriority = ['ROLE_ADMIN', 'ROLE_TRAINER', 'ROLE_USER']; // Jerarquía de roles
    for (const role of rolePriority) {
        if (roles.includes(role)) {
            console.log("aqui el rol", role);
            return role;
          }
          
    }
    return 'ROLE_USER'; // Rol predeterminado si no se encuentra otro
  };
  
  