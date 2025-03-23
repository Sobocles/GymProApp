// src/interfaces/UserInterface.ts

// src/interfaces/UserInterface.ts

export interface Role {
  authority: string;
}

export interface TrainerDetails {
  specialization?: string;
  experienceYears?: number;
  availability?: boolean;
  monthlyFee?: number;
  title?: string;
  studies?: string;
  certifications?: string;
  description?: string;
  instagramUrl?: string;
  whatsappNumber?: string;
}

export interface UserInterface {
  id: number;
  username: string;
  password?: string;
  email: string;
  admin: boolean;
  trainer?: boolean;
  role?: Role | string;
  roles?: string[];
  profileImageUrl?: string;
  trainerDetails?: TrainerDetails;
    certificationFile?: File;
}






