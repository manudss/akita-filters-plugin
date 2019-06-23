import {DataSource} from '@angular/cdk/table';
import {Observable} from 'rxjs';
import {ID, Order, QueryEntity} from '@datorama/akita';
// import { AkitaFilter, AkitaFiltersPlugin } from 'akita-filters-plugin';
import { MatSort, Sort } from '@angular/material/sort';
import {AkitaFilter} from '../akita-filters-store';
import {AkitaFiltersPlugin} from '../akita-filters-plugin';

export class AkitaMatDataSource<T, S = any> extends DataSource<T> {
  private _dataQuery: QueryEntity<S, T>;
  private _filters: AkitaFiltersPlugin<S, T, any>;

  constructor(query?: QueryEntity<S, T>) {
    super();
    this._dataQuery = query;
    this._filters = new AkitaFiltersPlugin(query);
  }

  set filter(filters: string) {
    if (filters === '') {
      this._filters.removeFilter('search');
    } else {
      this._filters.setFilter({id: 'search', value: filters});
    }
  }

  set sort(sort: MatSort) {
    sort.sortChange.subscribe((sortValue: Sort) => {
      // @ts-ignore
      this._filters.setSortBy({
        sortBy: sortValue.active as keyof T,
        sortByOrder: sortValue.direction === 'desc' ? Order.DESC : Order.ASC
      });
    });
  }

  get AkitaFilters(): AkitaFiltersPlugin<S, T, any> {
    return this._filters;
  }

  setFilter(filter: Partial<AkitaFilter<T>>): void {
    this._filters.setFilter(filter);
  }

  /**
   * Remove a AkitaFilter
   */
  removeFilter(id: ID): void {
    this._filters.removeFilter(id);
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    this._filters.clearFilters();
  }

  /**
   * Get filter value, return null, if value not available
   */
  getFilterValue<E = T>(id: string): E | null {
    return this._filters.getFilterValue(id);
  }

  public setDefaultSort(
    sortColumun: keyof T,
    direction: 'asc' | 'desc' = 'asc'
  ) {
    this._filters.setSortBy({
      sortBy: sortColumun,
      sortByOrder: direction === 'desc' ? Order.DESC : Order.ASC
    });
  }

  connect(): Observable<T[]> {
    return this._filters.selectAllByFilters();
  }

  /**
   * Used by the MatTable. Called when it is destroyed. No-op.
   * @docs-private
   */
  disconnect(): void {
    this._filters.clearFilters();
    this._filters.destroy();
  }
}
