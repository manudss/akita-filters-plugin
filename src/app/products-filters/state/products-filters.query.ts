import { Injectable } from '@angular/core';
import { ProductsFiltersStore, ProductPlantState } from './products-filters.store';
import { ProductPlant } from './products-filters.model';
import {getEntityType, getIDType, QueryConfig, QueryEntity} from '@datorama/akita';

@Injectable({
  providedIn: 'root'
})
@QueryConfig({
  sortBy: 'price'
})
export class ProductsFiltersQuery extends QueryEntity<ProductPlantState> {
  constructor(protected store: ProductsFiltersStore) {
    super(store);
  }

  getProducts(term: string, sortBy: keyof ProductPlant) {
    return this.selectAll({
      sortBy,
      filterBy: entity => entity.title.toLowerCase().includes(term)
    });
  }
}
