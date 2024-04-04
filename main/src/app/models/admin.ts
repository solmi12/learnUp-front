

import type { Cour } from "./cour.model";
import type { userDTO } from "./user";
export interface AdminDTO {
  adminId: number;
  firstName: string;
  lastName: string;
  userDTO: userDTO; 
}
