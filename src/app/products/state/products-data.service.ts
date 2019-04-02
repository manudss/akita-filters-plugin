import { Injectable } from '@angular/core';
import { mapTo } from 'rxjs/operators';
import { Observable, timer } from 'rxjs';
import { Product } from './products.model';
import { products } from '../products.mocks';
import { ID } from '@datorama/akita';

@Injectable({
  providedIn: 'root'
})
export class ProductsDataService {

  get(): Observable<Product[]> {
    return timer(500).pipe(mapTo(products));
  }


  getProduct(id: ID): Observable<Product> {
    const product = products.find(productData => productData.id === +id);
    return timer(500).pipe(mapTo(product));
  }
}
