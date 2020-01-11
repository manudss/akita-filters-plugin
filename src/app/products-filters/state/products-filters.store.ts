import { Injectable } from '@angular/core';
import { ProductPlant } from './products-filters.model';
import {EntityState, EntityStore, StoreConfig} from '@datorama/akita';

export interface ProductPlantState extends EntityState<ProductPlant> {}

@Injectable({
  providedIn: 'root'
})
@StoreConfig({
  name: 'productsFilters'
})
export class ProductsFiltersStore extends EntityStore<ProductPlantState> {
  constructor() {
    super();
  }
}
