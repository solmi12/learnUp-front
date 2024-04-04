export interface Chapitre {
  chapitreId?: number | null;

    titre: string;
    description: string;
    dureeEstimee: number;
    progressionComplete: boolean;
    ordreDansLeCours: number; 
    pdfAttachment: string;
    courId: number;
    imageData: string;
    youtubeVideoLink: string;
  }
  