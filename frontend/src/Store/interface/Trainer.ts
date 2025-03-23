export interface Trainer {
  id: number;
  username: string;
  email: string;
  specialization: string;
  experienceYears: number;
  availability: boolean;
  profileImageUrl: string;
  title: string;
  studies: string;
  certifications: string;
  description: string;
  monthlyFee: number; 
  instagramUrl?: string | null;
  whatsappNumber?: string | null;
  certificationFileUrl?: string | null;
}