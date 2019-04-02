import {Injectable} from '@angular/core';
import {mapTo} from 'rxjs/operators';
import {Observable, timer} from 'rxjs';
import {Product} from './products.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsDataService {

  /*get(): Observable<Product[]> {
    return timer(500).pipe(mapTo(products));
  }*/

}
