import { Injectable } from '@angular/core';
import { mapTo } from 'rxjs/operators';
import { Observable, timer } from 'rxjs';
import { ProductPlant } from './products-filters.model';
import { productsPlant } from '../products-filters.mocks';
import { ID } from '@datorama/akita';

@Injectable({
  providedIn: 'root'
})
export class ProductsFiltersDataService {

  get(): Observable<ProductPlant[]> {
    return timer(500).pipe(mapTo(productsPlant));
  }


  getProduct(id: ID): Observable<ProductPlant> {
    const product = productsPlant.find(productSet => productSet.id === +id);
    return timer(500).pipe(mapTo(product));
  }
}
