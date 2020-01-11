import {AkitaFilter, AkitaFiltersStore, createFilter, FiltersState} from './akita-filters-store';
import {AkitaFiltersQuery} from './akita-filters-query';
import {combineLatest, isObservable, merge, Observable, ObservedValueOf, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {
  compareValues,
  EntityCollectionPlugin,
  EntityState,
  EntityStore,
  getEntityType,
  getIDType,
  HashMap,
  ID,
  isFunction,
  isUndefined,
  OrArray,
  QueryEntity,
  SelectAllOptionsA,
  SelectAllOptionsB,
  SelectAllOptionsC,
  SelectAllOptionsD,
  SelectAllOptionsE,
  SortByOptions
} from '@datorama/akita';

export interface FiltersParams<S extends EntityState> {
  filtersStoreName?: string;
  entityIds?: OrArray<getIDType<S>>;

  [key: string]: any;
}

interface NormalizedFilterOptions {
  withSort?: boolean;
  asQueryParams?: boolean;
  sortByKey?: string;
  sortByOrderKey?: string;
}

export class AkitaFiltersPlugin<S extends EntityState, E = getEntityType<S>, I = OrArray<getIDType<S>>, P = any>
  extends EntityCollectionPlugin<S, P> {

  private readonly _filtersStore: AkitaFiltersStore<S>;
  private readonly _filtersQuery: AkitaFiltersQuery<S>;
  private _server: boolean = false;

  private _selectFilters$: Observable<AkitaFilter<S>[]>;
  private readonly _selectSortBy$: Observable<SortByOptions<E> | null>;
  private readonly _selectFiltersAll$: Observable<AkitaFilter<S>[]>;

  constructor(protected query: QueryEntity<S>, private params: FiltersParams<S> = {}) {
    super(query, params.entityIds);
    this.params = {...{filtersStoreName: this.getStore().storeName + 'Filters'}, ...params};

    this._filtersStore = new AkitaFiltersStore<S>(this.params.filtersStoreName);
    this._filtersQuery = new AkitaFiltersQuery<S>(this._filtersStore);

    this._selectFilters$ = this.filtersQuery.selectAll({sortBy: 'order'});
    this._selectFiltersAll$ = this.filtersQuery.selectAll({sortBy: 'order', filterBy: filter => !filter.hide});
    this._selectSortBy$ = this.filtersQuery.select(state => state && state.sort ? state.sort : null);
  }

  get filtersStore(): AkitaFiltersStore<S> {
    return this._filtersStore;
  }

  get filtersQuery(): AkitaFiltersQuery<S> {
    return this._filtersQuery;
  }

  /**
   *  Add support of filters from server. Provide a function that will be call each time a filter changes
   *
   *  new AkitaFilterPlugins(query).withServer((filters) => {
   *      return this.api.getData(filters);
   *  });
   *
   *  Return false to not add in store. if you want to manage the store in your own.
   */
  withServer(
    onChangeFilter: (filtersNormalized: string | HashMap<any>) => any | boolean,
    options: NormalizedFilterOptions = {}): AkitaFiltersPlugin<S, E, I, P> {
    this._server = true;

    // Change default select filters to remove server filters, if you use selectAllByFilters();
    this._selectFilters$ = this._filtersQuery.selectAll({sortBy: 'order', filterBy: filter => !filter.server});

    const listObservable: Array<Observable<any>> = [];
    listObservable.push(this._filtersQuery.selectAll({sortBy: 'order', filterBy: filter => filter.server}));

    if (options.withSort) {
      listObservable.push(this.selectSortBy());
    }
    merge<Observable<getEntityType<S>[]> | Observable<SortByOptions<E> | null>>(listObservable).subscribe(() => {
      const returnOnChange: boolean | Observable<getEntityType<S>[]> = onChangeFilter(this.getNormalizedFilters(options));

      if (returnOnChange !== false && isObservable(returnOnChange)) {
        returnOnChange.subscribe((newValue: getEntityType<S>[]) => {
          this.getStore().set(newValue);
        });
      }
    });
    return this;
  }

  /** Return true, if server is configured **/
  hasServer(): boolean {
    return this._server;
  }

  /**
   *  Select all filters
   *
   *  Note: Only all filters not hided (with hide=true), will not be displayed. If you want it, call directly to:
   * `this.filtersQuery.selectAll()`
   *
   *
   */
  selectFilters(): Observable<AkitaFilter<S>[]> {
    return this._selectFiltersAll$;
  }

  /**
   * Get all the current snapshot filters
   *
   *  Note: filters with hide=true, will not be displayed. If you want it, call directly to:
   * `this.filtersQuery.getAll()`
   */
  getFilters(): AkitaFilter<S>[] {
    return this._filtersQuery.getAll({filterBy: filter => !filter.hide});
  }

  /**
   * Get all the current snapshot server filters (only if server is available else return default not hidden filters)
   *
   *  Note: filters with server=false, will not be displayed. If you want it, call directly to:
   * `this.filtersQuery.getAll()`
   */
  getServerFilters(): AkitaFilter<S>[] {
    return this._server ? this._filtersQuery.getAll({filterBy: filter => !filter.server}) : this.getFilters();
  }

  /**
   * Select All Entity with apply filter to it, and updated with any change (entity or filter)
   * Will not apply sort, if need return   asObject:true !
   */
  selectAllByFilters(options?: SelectAllOptionsA<E>
    | SelectAllOptionsB<E> | SelectAllOptionsC<E> |
    SelectAllOptionsD<E> | SelectAllOptionsE<E> | any): Observable<getEntityType<S>[] | HashMap<getEntityType<S>>> {
    if (options && options.asObject) {
      return combineLatest(this._selectFilters$, this.getQuery().selectAll(options)).pipe(
        map(([filters, entities]) => {
          const unkNowEntity: unknown = entities;
          return this._applyFiltersForHashMap((unkNowEntity as HashMap<getEntityType<S>>), filters);
        })
      );
    } else {

      return combineLatest(this._selectFilters$, this.getQuery().selectAll(options), this.selectSortBy()).pipe(
        map(([filters, entities, sort]) => {
          const unkNowEntity: unknown = entities;
          return this._applyFiltersForArray((unkNowEntity as getEntityType<S>[]), filters, sort);
        })
      );
    }
  }

  /**
   * Create or update a filter
   */
  setFilter(filter: Partial<AkitaFilter<S>>) {
    if (this._server && isUndefined(typeof filter.server)) {
      filter.server = true;
    }
    const entity = createFilter(filter);
    this.filtersStore.upsert(entity.id, entity);
  }

  /**
   * Remove a Filter
   */
  removeFilter(id: ID) {
    this.filtersStore.remove(id);
  }

  /**
   * Clear all filters
   */
  clearFilters() {
    this.filtersStore.remove();
  }

  /**
   * Get filter value, return null, if value not available
   */
  getFilterValue<T = any>(id: string): T | null {
    if (this.filtersQuery.hasEntity(id)) {
      const entity: AkitaFilter<S> = this.filtersQuery.getEntity(id);
      return entity.value ? entity.value : null;
    }

    return null;
  }

  /**
   * Get filter value, return null, if value not available
   */
  getSortValue(): SortByOptions<E> | null {
    const state: FiltersState<S> = this.filtersQuery.getValue();
    return state.sort ? state.sort : null;
  }

  /**
   * Select Sort by value
   */
  public selectSortBy(): Observable<SortByOptions<E> | null> {
    return this._selectSortBy$;
  }

  /**
   * Set orderBy
   */
  setSortBy(order: SortByOptions<E>) {
    this.filtersStore.update({sort: order});
  }

  /**
   * Get the filters normalized as key value or as query params.
   * This can be useful for server-side filtering
   */
  getNormalizedFilters(options: NormalizedFilterOptions = {}): string | HashMap<any> {
    const result = {};
    options = {sortByKey: 'sortBy', sortByOrderKey: 'sortByOrder', ...options};

    for (const filter of this.getServerFilters()) {
      result[filter.id] = filter.value;
    }

    if (options.withSort) {
      const sort = this.getSortValue();
      result[options.sortByKey] = sort.sortBy;
      result[options.sortByOrderKey] = sort.sortByOrder;
    }

    if (options.asQueryParams) {
      return this._serialize(result);
    }

    return result;
  }

  destroy() {
    this.clearFilters();
  }



  /** This method is responsible for getting access to the query. */
  protected getQuery(): QueryEntity<S> {
    return this.query;
  }

  /** This method is responsible for getting access to the store. */
  protected getStore(): EntityStore<S> {
    return this.getQuery().__store__;
  }

  private _serialize(obj) {
    return Object.keys(obj)
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`)
      .join('&');
  }

  private _applyFiltersForArray(
    entities: getEntityType<S>[],
    filters: AkitaFilter<S>[],
    sort: ObservedValueOf<Observable<SortByOptions<E> | null>>): getEntityType<S>[] {
    let entitiesFiltered = entities;
    if (filters.length !== 0) {
      entitiesFiltered = entities.filter((entity: getEntityType<S>, index: number, array: getEntityType<S>[]) => {
        return filters.every((filter: AkitaFilter<S>) => {
          if (filter.predicate) {
            return !!filter.predicate(entity, index, array, filter);
          }
          return true;
        });
      });
    }

    if (sort && sort.sortBy) {
      const _sortBy: any = isFunction(sort.sortBy) ? sort.sortBy : compareValues(sort.sortBy, sort.sortByOrder);
      entitiesFiltered = [...entitiesFiltered.sort((a, b) => _sortBy(a, b, entities))];
    }
    return entitiesFiltered;
  }

  private _applyFiltersForHashMap(
    entities: HashMap<getEntityType<S>>,
    filters: AkitaFilter<S>[]): HashMap<getEntityType<S>> {
    if (filters.length === 0) {
      return entities;
    }
      const hashMapFiltered: HashMap<getEntityType<S>> = {};
      Object.keys(entities).forEach((entityKey: string, index: number) => {
        const entity: getEntityType<S> = entities[entityKey] as getEntityType<S>;
        if (this._applyFiltersForOneEntity(filters, entity, index, entities)) {
          hashMapFiltered[entityKey] = entity;
        }
      });

      return hashMapFiltered;
  }

  private _applyFiltersForOneEntity(filters: AkitaFilter<S>[],
                                    entity: getEntityType<S>, index: number,
                                    array: getEntityType<S>[] | HashMap<getEntityType<S>>) {
    return filters.every((filter: AkitaFilter<S>) => {
      if (filter.predicate) {
        return !!filter.predicate(entity, index, array, filter);
      }
      return true;
    });
  }

  protected instantiatePlugin(id: I): P {
    return null;
  }
}
