import {DataSource} from '@angular/cdk/table';
import {Observable} from 'rxjs';
import {ID, Order, QueryEntity} from '@datorama/akita';
import {MatSort, Sort} from '@angular/material';
import {AkitaFilter} from '../akita-filters-store';
import {AkitaFiltersPlugin} from '../akita-filters-plugin';

export class AkitaMatDataSource<T, S = any> extends DataSource<T> {
  private _dataQuery: QueryEntity<S, T>;
  private _filters: AkitaFiltersPlugin<S, T, any>;

  /**
   * Data source to use an Akita EntityStore with a Material table
   * @see : https://material.angular.io/components/table/overview
   *
   * @param query string : [Mandatory] the akita Query Entity, you wan to use to this data source.
   * @param akitaFilters string [Optional] If you want to provide an AkitaFilters that you use externally. Else it will create a new one.
   */
  constructor(query: QueryEntity<S, T>, akitaFilters?: AkitaFiltersPlugin<S, T, any>) {
    super();
    this._dataQuery = query;
    this._filters = akitaFilters ? akitaFilters : new AkitaFiltersPlugin<S, T, any>(query);
  }

  /**
   * @deprecated use search property
   * @param searchQuery teh string use to search
   */
  set filter(searchQuery: string) {
    this.search = searchQuery;
  }

  /**
   * filter all the list by a search term.
   *
   * use like a property :
   * akitaMatDataSourceInstance.search = 'term';
   * @param searchQuery the string use to search
   */
  set search(searchQuery: string) {
    if (searchQuery === '') {
      this._filters.removeFilter('search');
    } else {
      this._filters.setFilter({id: 'search', value: searchQuery});
    }
  }

  /**
   * @param sort MatSort set the Mat Sort to subscribe to sort change.
   */
  set sort(sort: MatSort) {
    sort.sortChange.subscribe((sortValue: Sort) => {
      // @ts-ignore
      this._filters.setSortBy({
        sortBy: sortValue.active as keyof T,
        sortByOrder: sortValue.direction === 'desc' ? Order.DESC : Order.ASC
      });
    });
  }

  /**
   * Access to AkitaFiltersPlugins, usefull to interact with all filters
   */
  get AkitaFilters(): AkitaFiltersPlugin<S, T, any> {
    return this._filters;
  }

  /**
   *  add a filter to filters plugins
   */
  addFilter(filter: Partial<AkitaFilter<T>>): void {
    this._filters.setFilter(filter);
  }

  /**
   *  add a filter to filters plugins
   */
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

  /**
   * Set the default sort
   * @param sortColumun the colum name present in your object
   * @param direction string the direction for sorting (asc or desc). Default asc.
   */
  public setDefaultSort(
    sortColumun: keyof T,
    direction: 'asc' | 'desc' = 'asc'
  ) {
    this._filters.setSortBy({
      sortBy: sortColumun,
      sortByOrder: direction === 'desc' ? Order.DESC : Order.ASC
    });
  }

  /**
   * Function used by matTable to subscribe to the data
   */
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
