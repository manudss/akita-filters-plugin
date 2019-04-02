import {Component, OnInit} from '@angular/core';
import {ProductPlant, ProductsFiltersQuery, ProductsFiltersService} from './state';
import {Observable} from 'rxjs';
import {CartService} from '../cart/state';

@Component({
  selector: 'app-products-list',
  templateUrl: `./products-list.component.html`
})
export class ProductsListComponent implements OnInit {
  products$: Observable<ProductPlant[]>;
  loading$: Observable<boolean>;

  constructor(private productsService: ProductsFiltersService, private cartService: CartService, private productsQuery: ProductsFiltersQuery) {
  }

  ngOnInit() {
    this.productsService.get().subscribe();
    this.loading$ = this.productsQuery.selectLoading();

    this.products$ = this.productsService.selectAll();
  }


  addProductToCart({id}: ProductPlant) {
    this.cartService.addProductToCart(id);
  }


  subtract({id}: ProductPlant) {
    this.cartService.subtract(id);
  }
}
