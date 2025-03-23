// UserInterface.ts
export interface UserState {
    id?: string;
    username: string;
    password: string;
    email: string;
    admin: boolean;
    trainer: boolean;
      // Agregar la propiedad 'role'
    role: string;
    // O si manejas roles como un array:
    roles: string[];
    // Otros campos...
    profileImageUrl: string;
}
