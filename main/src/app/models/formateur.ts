// formateur.model.ts

import type { Cour } from "./cour.model";
import type { userDTO } from "./user";
export interface Formateur {
  formateurId: number;
  userDTO: userDTO;
  fullName: string;
  expertise: string;
  experience: string;
  phoneNumber: string;
  courDtos:Cour[]  | null;
 
}
