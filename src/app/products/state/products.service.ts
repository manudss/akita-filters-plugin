import {Injectable} from '@angular/core';
import {ProductsStore} from './products.store';
import {ProductsDataService} from './products-data.service';
import {ProductsQuery} from './products.query';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(
    private productsStore: ProductsStore,
    private productsQuery: ProductsQuery,
    private productsDataService: ProductsDataService) {
  }
}
