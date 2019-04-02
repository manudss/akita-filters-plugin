import {Injectable} from '@angular/core';
import {ProductsStore} from './products.store';
import {ProductsDataService} from './products-data.service';
import {Product} from './products.model';
import {tap} from 'rxjs/operators';
import {empty, Observable} from 'rxjs';
import {ProductsQuery} from './products.query';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  constructor(private productsStore: ProductsStore, private productsQuery: ProductsQuery, private productsDataService: ProductsDataService) {
  }


  /*get(): Observable<Product[]> {
    const request = this.productsDataService.get().pipe(
      tap(response => {
        this.productsStore.set(response);
        // applyAction(
        //   () => {
        //     this.productsStore.set(response);
        //   },
        //   { type: '[Products Service] Fetch All' }
        // );
      })
    );

    return this.productsQuery.getHasCache() === false ? request : empty();
  }*/


}
