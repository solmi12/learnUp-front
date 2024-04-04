import type { ApprenantCour } from "./ApprenantCour";
import type { userDTO } from "./user";

export interface Apprenant {
  apprenantId: number;
  userDTO: userDTO;
  fullName: string;
  interests: string;
  educationLevel: string;
  apprenantCourList?: ApprenantCour[];
}
