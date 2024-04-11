
import type { userDTO } from "./user";

export interface Apprenant {
  apprenantId: number;
  userDTO: userDTO;
  fullName: string;
  interests: string;
  classe:string;
  educationLevel: string;
}
