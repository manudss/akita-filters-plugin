import {AkitaFiltersStore, FiltersState} from './akita-filters-store';
import {AkitaFiltersQuery} from './akita-filters-query';
import {BehaviorSubject, combineLatest, isObservable, Observable, ObservedValueOf, of, Subject, Subscription} from 'rxjs';
import {distinctUntilChanged, map} from 'rxjs/operators';
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
import {AkitaFilter, AkitaFilterBase, AkitaFilterLocal, AkitaFilterServer, createFilter} from './akita-filters.model';

export interface FiltersParams<S extends EntityState> {
  filtersStoreName?: string;
  entityIds?: OrArray<getIDType<S>>;
  filtersStore?: AkitaFiltersStore<S>;
  filtersQuery?: AkitaFiltersQuery<S>;
  [key: string]: any;
}

export interface NormalizedFilterOptions {
  withSort?: boolean;
  asQueryParams?: boolean;
  sortByKey?: string;
  sortByOrderKey?: string;
}

export interface WithServerOptions extends NormalizedFilterOptions {
  [key: string]: any;
}

export class AkitaFiltersPlugin<S extends EntityState, E = getEntityType<S>, I = OrArray<getIDType<S>>, P = any>
  extends EntityCollectionPlugin<S, P> {
  get withServerOptions(): WithServerOptions {
    return this._withServerOptions;
  }

  set withServerOptions(value: WithServerOptions) {
    this._withServerOptions = value;
  }

  private readonly _filtersStore: AkitaFiltersStore<S>;
  private readonly _filtersQuery: AkitaFiltersQuery<S>;
  private readonly _refresh$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private _server: boolean = false;

  private _selectFilters$: Observable<Array<AkitaFilterBase<S>>>;
  private readonly _selectSortBy$: Observable<SortByOptions<E> | null>;
  private readonly _selectFiltersAll$: Observable<Array<AkitaFilterBase<S>>>;
  private _onChangeFilter: (filtersNormalized: (string | HashMap<any>)) => any | boolean | Observable<Array<getEntityType<S>>>;
  private _lastServerSubscription: Subscription;
  private _withServerOptions: WithServerOptions = {};

  constructor(protected query: QueryEntity<S>, private params: FiltersParams<S> = {}) {
    super(query, params.entityIds);
    this.params = {...{filtersStoreName: this.getStore().storeName + 'Filters'}, ...params};

    this._filtersStore = (params.filtersStore) ? params.filtersStore : new AkitaFiltersStore<S>(this.params.filtersStoreName);
    this._filtersQuery = (params.filtersQuery) ? params.filtersQuery : new AkitaFiltersQuery<S>(this._filtersStore);

    this._selectFilters$ = this.filtersQuery.selectAll({sortBy: 'order'});
    this._selectFiltersAll$ = this.filtersQuery.selectAll({sortBy: 'order', filterBy: filter => !filter?.hide});
    this._selectSortBy$ = this.filtersQuery.select(state => state?.sort);
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
    options: WithServerOptions = {}): AkitaFiltersPlugin<S, E, I, P> {
    options = {...options};

    this.server = true;
    this.withServerOptions = options;
    this._onChangeFilter = onChangeFilter;

    // Change default select filters to remove server filters, if you use selectAllByFilters();
    this._selectFilters$ = this._filtersQuery.selectAll({sortBy: 'order', filterBy: filter => !(filter as AkitaFilterServer<S>)?.server});

    const listObservable: Array<Observable<any>> = [];
    listObservable.push(this._filtersQuery.selectAll({sortBy: 'order', filterBy: filter => (filter as AkitaFilterServer<S>)?.server === true})
      .pipe(distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))));


    if (this.withServerOptions.withSort) {
      listObservable.push(this.selectSortBy() ?? of(null));
    }
    listObservable.push(this._refresh$);

    combineLatest<Observable<Array<getEntityType<S>>> | Observable<SortByOptions<E> | null>> (listObservable)
      .pipe(map((data) => {
      return this.getNormalizedFilters(this.withServerOptions);
    })).subscribe((normalizerFilters) => {
      const returnOnChange: boolean | Observable<Array<getEntityType<S>>> = this._onChangeFilter(normalizerFilters);

      if (returnOnChange !== false && isObservable(returnOnChange)) {
        if (this._lastServerSubscription) { this._lastServerSubscription.unsubscribe(); }
        this._lastServerSubscription = returnOnChange.subscribe((newValue: Array<getEntityType<S>>) => {
          this.getStore().set(newValue);
        });
      }
    });
    return this;
  }

  get server(): boolean {
    return this._server;
  }

  set server(value: boolean) {
    this._server = value;
  }


  /** Return true, if server is configured **/
  hasServer(): boolean {
    return this.server;
  }

  /**
   *  Select all filters
   *
   *  Note: Only all filters not hide (with hide=true), will not be displayed. If you want it, call directly to:
   * `this.filtersQuery.selectAll()`
   *
   *
   */
  selectFilters(): Observable<Array<AkitaFilterBase<S>>> {
    return this._selectFiltersAll$;
  }

  /**
   * Get all the current snapshot filters
   *
   *  Note: filters with hide=true, will not be displayed. If you want it, call directly to:
   * `this.filtersQuery.getAll()`
   */
  getFilters(): Array<AkitaFilterBase<S>> {
    return this._filtersQuery.getAll({filterBy: filter => !filter.hide});
  }

  /**
   * Get all the current snapshot server filters (only if server is available else return default not hidden filters)
   *
   *  Note: filters with server=false, will not be displayed. If you want it, call directly to:
   * `this.filtersQuery.getAll()`
   */
  getServerFilters(): Array<AkitaFilterServer<S>> {
    return this.server ?
      this._filtersQuery.getAll({filterBy: filter => (filter as AkitaFilterServer<S>)?.server})  as Array<AkitaFilterServer<S>>
      : this.getFilters() as Array<AkitaFilterServer<S>>;
  }

  /**
   * Select All Entity with apply filter to it, and updated with any change (entity or filter)
   * Will not apply sort, if need return   asObject:true !
   */
  selectAllByFilters(options?: SelectAllOptionsA<E>
    | SelectAllOptionsB<E> | SelectAllOptionsC<E> |
    SelectAllOptionsD<E> | SelectAllOptionsE<E> | any): Observable<Array<getEntityType<S>> | HashMap<getEntityType<S>>> {
    const listObservable: Array<Observable<any>> = [];
    listObservable.push(this._selectFilters$, this.getQuery().selectAll(options), this._refresh$);

    if (options && options.asObject) {
      return combineLatest(listObservable).pipe(
        map((values) => {
          const [filters, entities, refresh] = values;
          const unkNowEntity: unknown = entities;
          return this._applyFiltersForHashMap((unkNowEntity as HashMap<getEntityType<S>>), filters);
        }),
      );
    } else {
      let sortBy = this.selectSortBy();
      if (this.server && this._withServerOptions?.withSort) {
        sortBy = sortBy.pipe(map(data => null));
      }
      listObservable.push(sortBy);

      return combineLatest(listObservable).pipe(
        map((values) => {
          const [filters, entities, refresh, sort ] = values;
          const unkNowEntity: unknown = entities;
          return this._applyFiltersForArray((unkNowEntity as Array<getEntityType<S>>), filters, sort);
        }),
      );
    }
  }

  /**
   * Get All Entity with apply filter to it, and updated with any change (entity or filter)
   * Will not apply sort, if need return   asObject:true !
   */
  getAllByFilters(options?: SelectAllOptionsA<E>
    | SelectAllOptionsB<E> | SelectAllOptionsC<E> |
    SelectAllOptionsD<E> | SelectAllOptionsE<E> | any): getEntityType<S>[] | HashMap<getEntityType<S>> {
    const filters = this.filtersQuery.getAll();
    const unkNowEntity: unknown = this.getQuery().getAll(options);
    if (options && options.asObject) {
      return this._applyFiltersForHashMap((unkNowEntity as HashMap<getEntityType<S>>), filters);
    } else {
      const sort = this.getSortBy();
      return this._applyFiltersForArray((unkNowEntity as getEntityType<S>[]), filters, sort);
    }
  }

  public getSortBy() {
    const state = this.filtersQuery.getValue();
    return state && state.sort ? state.sort : null;
  }

  /**
   * Create or update a filter
   */
  setFilter(filter: Partial<AkitaFilterBase<S> | AkitaFilterLocal<S> | AkitaFilterServer<S> | AkitaFilter<S>>) {
    filter = this.updateServerIfNeeded(filter);
    const entity = createFilter(filter as AkitaFilterBase<S>);
    // noinspection TypeScriptValidateTypes
    this.filtersStore.upsert(entity.id, entity);
  }

  private updateServerIfNeeded(filter: Partial<AkitaFilterBase<S>>) {
    if (this.server && isUndefined((filter as AkitaFilterServer<S>)?.server)) {
      (filter as AkitaFilterServer<S>).server = true;
    }
    return filter;
  }

  /**
   * Create or update multiples filters
   */
  setFilters(filters: Array<Partial<AkitaFilterBase<S> | AkitaFilterLocal<S> | AkitaFilterServer<S> | AkitaFilter<S>>>) {
    if (!filters) { return; }
    const entities = filters.map((filter => {
      filter = this.updateServerIfNeeded(filter);
      return createFilter(filter);
    }));

    this.filtersStore.upsertMany(entities);
  }

  /**
   * Remove a Filter
   */
  removeFilter(id: ID) {
    this.filtersStore.remove(id as unknown as OrArray<I>);
  }

  /**
   * Remove a Filter
   */
  removeFilters(ids: ID[]) {
    this.filtersStore.remove(ids);
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
      const entity: AkitaFilterBase<S> = this.filtersQuery.getEntity(id);
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
  selectSortBy(): Observable<SortByOptions<E> | null> {
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
    const sort = this.getSortValue();
    if (options.withSort && sort?.sortBy) {
      result[options.sortByKey] = sort?.sortBy;
      result[options.sortByOrderKey] = sort?.sortByOrder;
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
  getQuery(): QueryEntity<S> {
    return this.query;
  }

  /** This method is responsible for getting access to the store. */
  getStore(): EntityStore<S> {
    return this.getQuery().__store__;
  }

  /**
   * Trigger a refresh of the data. This will force the library to replay all filters.
   * Very useful for the withServer feature, because it allows to call back the with server callback function with the same parameters, to make a new call to the api.
   */
  refresh() {
      const value = this._refresh$.getValue() + 1;
      this._refresh$.next(value);
      return value;
  }

  private _serialize(obj) {
    return Object.keys(obj)
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`)
      .join('&');
  }

  private _applyFiltersForArray(
    entities: Array<getEntityType<S>>,
    filters: Array<AkitaFilterBase<S>>,
    sort: ObservedValueOf<Observable<SortByOptions<E> | null>>): Array<getEntityType<S>> {
    let entitiesFiltered = entities;
    if (filters.length !== 0) {
      entitiesFiltered = entities.filter((entity: getEntityType<S>, index: number, array: Array<getEntityType<S>>) => {
        return filters.every((filter: AkitaFilterBase<S>) => {
          if ((filter as AkitaFilterLocal<S>)?.predicate) {
            return !!(filter as AkitaFilterLocal<S>).predicate(entity, index, array, filter);
          }
          return true;
        });
      });
    }
    const sortOptions = (sort as SortByOptions<E>);
    if (sortOptions?.sortBy) {
      const _sortBy: any = isFunction(sortOptions.sortBy) ? sortOptions.sortBy : compareValues(sortOptions.sortBy, sortOptions.sortByOrder);
      entitiesFiltered = [...entitiesFiltered.sort((a, b) => _sortBy(a, b, entities))];
    }
    return entitiesFiltered;
  }

  private _applyFiltersForHashMap(
    entities: HashMap<getEntityType<S>>,
    filters: Array<AkitaFilterBase<S>>): HashMap<getEntityType<S>> {
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

  private _applyFiltersForOneEntity(filters: Array<AkitaFilterBase<S>>,
                                    entity: getEntityType<S>, index: number,
                                    array: Array<getEntityType<S>> | HashMap<getEntityType<S>>) {
    return filters.every((filter: AkitaFilterBase<S>) => {
      if ((filter as AkitaFilterLocal<S>)?.predicate) {
        return !!(filter as AkitaFilterLocal<S>).predicate(entity, index, array, filter);
      }
      return true;
    });
  }

  protected instantiatePlugin(id: I): P {
    return null;
  }
}
