import type { Chapitre } from "./Chapitre";

export interface Cour {
    courId?: number | null;
    courName: string;
    description: string;
    price:number;
    needsReview: boolean;
    status:string;
    chapitres?: Chapitre[];
    category: {
      categoryName: string;
    };
    imageData: string;
    formateurId: number;
     
    discountedPrice?: number | null;
    totalPrice?: number | null;
  }
  
  export interface Category {
    categoryId: number;
    categoryName: string;
    cour: Cour[];

  }
  