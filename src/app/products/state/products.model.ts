import { ID } from '@datorama/akita';

export interface Product {
  id: ID;
  title: string;
  description: string;
  price: number;
}
