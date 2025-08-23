export interface Exercise {
  id: number;
  name: string;
  category: string;
  equipment?: string;
  description?: string;
  scalingOptions?: string[];
}
