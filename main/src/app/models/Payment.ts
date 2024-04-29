import type { Cour } from "./cour.model";

export interface Payment {
    paymentId?: number;
    apprenantId: number;
    courId: number;
    paymentDate: Date;
    paymentPrice: number;
    courName: string;
    fullName?: string;
    totalPrice: number;
    cour?: Cour;
  }
  