import { Injectable } from '@angular/core';
import { ProductPlantState, ProductsFiltersStore } from './products-filters.store';
import { ProductsFiltersDataService } from './products-filters-data.service';
import { ProductPlant } from './products-filters.model';
import { tap } from 'rxjs/operators';
import {empty, Observable} from 'rxjs';
import { ProductsFiltersQuery } from './products-filters.query';
import {Order} from '@datorama/akita';
import {AkitaFilter} from '../../../../projects/akita-filters-plugin/src/lib/akita-filters-store';
import {AkitaFiltersPlugin} from '../../../../projects/akita-filters-plugin/src/lib/akita-filters-plugin';


@Injectable({
  providedIn: 'root'
})
export class ProductsFiltersService {
  filtersProduct: AkitaFiltersPlugin<ProductPlantState, ProductPlant>;

  constructor( private productsStore: ProductsFiltersStore,
               private productsQuery: ProductsFiltersQuery,
               private productsDataService: ProductsFiltersDataService ) {
    this.filtersProduct = new AkitaFiltersPlugin<ProductPlantState, ProductPlant>(this.productsQuery);
  }


  get(): Observable<ProductPlant[]> {
    const request = this.productsDataService.get().pipe(
      tap(response => {
        this.productsStore.set(response);
      })
    );

    return this.productsQuery.getHasCache() === false ? request : empty();
  }

  setFilter( filter: AkitaFilter<ProductPlant> ) {
    this.filtersProduct.setFilter(filter);
  }

  setOrderBy( by: any, order: string | '+' | '-' ) {
    this.filtersProduct.setSortBy({ sortBy: by, sortByOrder: order === '+' ? Order.ASC : Order.DESC });
  }

  removeFilter( id: string ) {
    this.filtersProduct.removeFilter(id);
  }

  removeAllFilter() {
    this.filtersProduct.clearFilters();
  }

  getFilterValue( id: string ): any | null {
    return this.filtersProduct.getFilterValue(id);
  }

  getSortValue(): string | null {
    const sortValue = this.filtersProduct.getSortValue();
    if ( !sortValue ) { return '+title'; }
    const order = sortValue.sortByOrder === Order.ASC ? '+' : '-';
    return sortValue.sortBy ? order + sortValue.sortBy : '+title';
  }

  selectFilters(): Observable<AkitaFilter<ProductPlant>[]> {
    return this.filtersProduct.selectFilters();
  }

  selectAll(): Observable<ProductPlant[]> {
    return this.filtersProduct.selectAllByFilters();
  }

}
