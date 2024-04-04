export interface userDTO {
    userId: number;
    email: string;
    password: string;
    role: Role;
  
    formateurId: number | undefined;

    
  }
  
  
  export enum Role {
    ADMIN = 'ADMIN',
    FORMATEUR = 'FORMATEUR',
    APPRENANT = 'APPRENANT'
  }
  