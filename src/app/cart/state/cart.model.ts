import { Product } from '../../products/state';

export interface CartItem {
  productId: Product['id'];
  quantity: number;
  total: number;
}


export function createCartItem(params: Partial<CartItem>) {
  return {
    total: 0,
    quantity: 1,
    ...params
  } as CartItem;
}
