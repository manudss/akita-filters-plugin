// file deepcode ignore no-any: use any while sometime error with type any added was to evit a bug with typescript in external project.
import {DataSource} from '@angular/cdk/table';
import {BehaviorSubject, combineLatest, merge, Observable, Subject, Subscription} from 'rxjs';
import {EntityState, getEntityType, HashMap, ID, Order, QueryEntity} from '@datorama/akita';
import {debounceTime, map, takeUntil, tap, filter} from 'rxjs/operators';
import {MatSort, Sort} from '@angular/material/sort';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
// @ts-ignore
import {AkitaFilter, AkitaFiltersPlugin, WithServerOptions, compareFiltersArray} from 'akita-filters-plugin';
import {DataSourceWithServerOptions} from './data-source-with-server-options.model';

export class AkitaMatDataSource<S extends EntityState = any, E = getEntityType<S>> extends DataSource<E> {

  /**
   * subscribe to be noticed when a filters has changed (and with server pagination, will exclude pagination filters).
   */
  public onFiltersChanges$: Observable<Array<AkitaFilter<S>>>;

  private _dataQuery: QueryEntity<E>;
  private _filters: AkitaFiltersPlugin<S>;
  /** if set a custom filter plugins, do not delete all in disconnect() **/
  private _hasCustomAkitaFiltersPlugins: boolean;
  private _selectAllByFilter$: Observable<E[]>;
  private _count$: BehaviorSubject<number>;
  /** Used to react to internal changes of the paginator that are made by the data source itself. */
  private readonly _internalPageChanges = new Subject<void>();
  /** Stream emitting render data to the table (depends on ordered data changes). */
  private readonly _renderData = new BehaviorSubject<E[]>([]);
  /** Used to react to internal changes of the paginator that are made by the data source itself. */
  private readonly _disconnect = new Subject<void>();
  private _dataSourceOptions: DataSourceWithServerOptions;
  /**
   * Subscription to the changes that should trigger an update to the table's rendered rows, such
   * as filtering, sorting, pagination, or base data changes.
   */
  private _renderChangesSubscription = Subscription.EMPTY;
  private _serverPaginationSubscription: Subscription = Subscription.EMPTY;
  private _previousFilters: Array<AkitaFilter<S>>;

  /**
   * Data source to use an Akita EntityStore with a Material table
   * @see : https://material.angular.io/components/table/overview
   *
   * @param query string : [Mandatory] the akita Query Entity, you wan to use to this data source.
   * @param akitaFilters string [Optional] If you want to provide an AkitaFilters that you use externally. Else it will create a new one.
   * @param dataSourceOptions [Optional] If you want to specify some options for user
   */
  constructor(query: QueryEntity<getEntityType<S>> | any,
              akitaFilters: AkitaFiltersPlugin<S> = null,
              dataSourceOptions: DataSourceWithServerOptions = {}) {
    super();
    this._dataSourceOptions = {
      searchFilterId: 'search',
      serverPagination: false,
      pageIndexId: 'page',
      pageIndexName: 'Page',
      pageIndexDisplay: false,
      pageSizeId: 'size',
      pageSizeName: 'Size',
      pageSizeDisplay: false,
      debounceTimeBetweenTwoChanges: 60,
      resetPageIndexOnFiltersChange: true,
      ...dataSourceOptions
    };
    this._dataQuery = query;

    this._filters = akitaFilters ? akitaFilters : new AkitaFiltersPlugin<S>(query);
    this._hasCustomAkitaFiltersPlugins = !!akitaFilters;
    this._count$ = new BehaviorSubject(0);

    this._previousFilters = [];

    this.onFiltersChanges$ = this._filters.filtersQuery.selectAll({
      sortBy: 'order',
      filterBy: filterConfig => filterConfig.id !== this.options.pageIndexId && filterConfig.id !== this.options.pageSizeId
    }).pipe(
      filter((current) => !compareFiltersArray<S>(this._previousFilters, current)),
      tap((data: Array<AkitaFilter<S>>) => this._previousFilters = data),
    );
    this._updateChangeSubscription();
  }

  get filter(): string {
    return this.search;
  }

  /**
   * @param searchQuery teh string use to search
   */
  set filter(searchQuery: string) {
    this.search = searchQuery;
  }

  get search(): string {
    return this._filters.getFilterValue<string>(this._dataSourceOptions.searchFilterId);
  }

  /**
   * filter all the list by a search term.
   *
   * use like a property :
   * akitaMatDataSourceInstance.search = 'term';
   * @param searchQuery the string use to search
   */
  set search(searchQuery: string) {
    if (searchQuery === '' || !searchQuery) {
      this._filters.removeFilter(this._dataSourceOptions.searchFilterId);
    } else {
      // noinspection TypeScriptValidateTypes
      this._filters.setFilter({id: this._dataSourceOptions.searchFilterId, value: searchQuery, name: searchQuery});
    }
  }

  /**
   * @deprecated use get akitaFiltersPlugin
   */
  get AkitaFilters(): AkitaFiltersPlugin<S> {
    return this._filters;
  }

  /**
   * Access to AkitaFiltersPlugins, usefull to interact with all filters
   */
  get akitaFiltersPlugIn(): AkitaFiltersPlugin<S> {
    return this._filters;
  }

  private _paginator: MatPaginator | any = null;

  /**
   * Instance of the MatPaginator component used by the table to control what page of the data is
   * displayed. Page changes emitted by the MatPaginator will trigger an update to the
   * table's rendered data.
   *
   * Note that the data source uses the paginator's properties to calculate which page of data
   * should be displayed. If the paginator receives its properties as template inputs,
   * e.g. `[pageLength]=100` or `[pageIndex]=1`, then be sure that the paginator's view has been
   * initialized before assigning it to this data source.
   *
   * Important : Must be a MatPaginator, the type any added was to evit a bug with typescript
   * where MatSort was different in external project.
   */
  get paginator(): MatPaginator | any {
    return this._paginator;
  }

  set paginator(paginator: MatPaginator | any) {
    this._paginator = paginator;
    this.updateSubscriptions();
  }

  private _sort: MatSort | any = null;

  /**
   * Instance of the MatSort component used by the table to sort data
   */
  get sort(): MatSort | any {
    return this._sort;
  }

  /**
   * Instance of the MatSort directive used by the table to control its sorting. Sort changes
   * emitted by the MatSort will trigger an update to the table's rendered data.
   *
   * Important : Must be a MatSort, the type any added was to evit a bug with typescript where MatSort was different in external project.
   */
  set sort(sort: MatSort | any) {
    this._sort = sort;
    sort.sortChange.pipe(takeUntil(this._disconnect)).subscribe((sortValue: Sort) => {
      this._filters.setSortBy({
        sortBy: sortValue.active as keyof E,
        sortByOrder: sortValue.direction === 'desc' ? Order.DESC : Order.ASC
      });
    });

    sort.initialized.subscribe(() => {
      this.setDefaultSort(sort.active as keyof E, sort.direction === 'desc' ? Order.DESC : Order.ASC);
    });
  }

  get server(): boolean {
    return this.akitaFiltersPlugIn.server;
  }

  set server(value: boolean) {
    this.akitaFiltersPlugIn.server = value;
  }

  /**
   * set and get total for paginator, when use in server pagination
   */
  get total(): number {
    return this.paginator?.length;
  }

  set total(value: number) {
    if (this.paginator) {
      this.paginator.length = value;
    }
  }

  get options(): DataSourceWithServerOptions {
    return this._dataSourceOptions;
  }

  set options(dataSourceOptions: DataSourceWithServerOptions) {
    this._dataSourceOptions = {
      ...this._dataSourceOptions,
      ...dataSourceOptions
    };
    this.updateSubscriptions();
  }

  withOptions(dataSourceOptions: DataSourceWithServerOptions) {
    this.options = dataSourceOptions;
    return this;
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
  public withServer(
    onChangeFilter: (filtersNormalized: string | HashMap<any>) => any | boolean,
    options: WithServerOptions = {}): AkitaMatDataSource<S, E> {
    options = {...options};

    this.server = true;
    this._filters = this._filters.withServer(onChangeFilter, options);

    return this;
  }

  /**
   *  add a filter to filters plugins
   */
  addFilter(akitaFilter: Partial<AkitaFilter<S>>): void {
    this._filters.setFilter(akitaFilter);
  }

  /**
   *  add or update a filter to filters plugins
   */
  setFilter(akitaFilter: Partial<AkitaFilter<S>>): void {
    this._filters.setFilter(akitaFilter);
  }

  /**
   *  add or update multiple filter to filters plugins
   */
  setFilters(filters: Array<Partial<AkitaFilter<S>>>): void {
    this._filters.setFilters(filters);
  }

  /**
   * Remove a AkitaFilter
   */
  removeFilter(id: ID): void {
    this._filters.removeFilter(id);
  }

  /**
   * Remove a Filter
   */
  removeFilters(ids: ID[]) {
    this._filters.removeFilters(ids);
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
  getFilterValue<V = E>(id: string): V | null {
    return this._filters.getFilterValue(id);
  }

  /**
   * Set the default sort
   * @param sortColumn the colum name present in your object
   * @param direction string the direction for sorting (asc or desc). Default asc.
   */
  public setDefaultSort(
    sortColumn: keyof E,
    direction: 'asc' | 'desc' = 'asc'
  ) {
    this._filters.setSortBy({
      sortBy: sortColumn,
      sortByOrder: direction === 'desc' ? Order.DESC : Order.ASC
    });
  }

  /**
   * Select Count filtered results.
   */
  selectCount(): Observable<number> {
    return this._count$;
  }

  /**
   * Select Count filtered results.
   */
  getCount(): number {
    return this._count$.getValue();
  }

  /**
   * Function used by matTable to subscribe to the data
   */
  connect(): Observable<E[]> {
    return this._renderData.pipe(takeUntil(this._disconnect));
  }

  /**
   * Used by the MatTable. Called when it is destroyed. No-op.
   * @docs-private
   */
  disconnect(): void {
    if (!this._hasCustomAkitaFiltersPlugins) {
      this._filters.clearFilters();
      this._filters.destroy();
    }
    this._renderChangesSubscription?.unsubscribe();
    this._serverPaginationSubscription?.unsubscribe();
    this._disconnect.next();
    this._disconnect.complete();
  }

  private updateSubscriptions() {
    if (this.server && this._dataSourceOptions.serverPagination) {
      this._subscribeServerPagination(this._paginator);
    }
    this._updateChangeSubscription();
  }

  /**
   * Subscribe to changes that should trigger an update to the table's rendered rows. When the
   * changes occur, process the current state of the filter, sort, and pagination along with
   * the provided base data and send it to the table for rendering.
   */
  private _updateChangeSubscription() {
    // @ts-ignore ignore, as without options, we will always have an Array.
    this._selectAllByFilter$ = this._filters.selectAllByFilters();

    let subscription;

    if (this.paginator && !this._dataSourceOptions.serverPagination) {
      // Sorting and/or pagination should be watched if MatSort and/or MatPaginator are provided.
      // The events should emit whenever the component emits a change or initializes, or if no
      // component is provided, a stream with just a null event should be provided.
      // The `sortChange` and `pageChange` acts as a signal to the combineLatests below so that the
      // pipeline can progress to the next step. Note that the value from these streams are not used,
      // they purely act as a signal to progress in the pipeline.
      const pageChange: Observable<PageEvent | null | void> = merge(
        this.paginator.page,
        this._internalPageChanges,
        this.paginator.initialized
      ) as Observable<PageEvent | void>;

      subscription = combineLatest([this._selectAllByFilter$, pageChange])
        .pipe(map(([data, page]) => this._pageData(data)));
    } else {
      subscription = this._selectAllByFilter$.pipe(tap(data => this._updateCount(data)));
    }
    subscription.pipe(
      takeUntil(this._disconnect),
      debounceTime(this._dataSourceOptions.debounceTimeBetweenTwoChanges)
    );
    // Watched for paged data changes and send the result to the table to render.
    this._renderChangesSubscription.unsubscribe();
    this._renderChangesSubscription = subscription.subscribe(data => this._renderData.next(data));

    this._internalPageChanges.next();
  }

  /**
   * Updates the paginator to reflect the length of the filtered data, and makes sure that the page
   * index does not exceed the paginator's last page. Values are changed in a resolved promise to
   * guard against making property changes within a round of change detection.
   */
  private _updatePaginator(filteredDataLength: number) {
    Promise.resolve().then(() => {
      const paginator = this.paginator;

      if (!paginator) {
        return;
      }

      paginator.length = filteredDataLength;

      // If the page index is set beyond the page, reduce it to the last page.
      if (paginator.pageIndex > 0) {
        const lastPageIndex = Math.ceil(paginator.length / paginator.pageSize) - 1 || 0;
        const newPageIndex = Math.min(paginator.pageIndex, lastPageIndex);

        if (newPageIndex !== paginator.pageIndex) {
          paginator.pageIndex = newPageIndex;

          // Since the paginator only emits after user-generated changes,
          // we need our own stream so we know to should re-render the data.
          this._internalPageChanges.next();
        }
      }
    });
  }

  private _subscribeServerPagination(paginator: any) {
    const {
      pageSizeName,
      pageSizeDisplay,
      pageIndexId,
      serverPagination,
      pageIndexDisplay,
      pageSizeId,
      pageIndexName,
      debounceTimeBetweenTwoChanges,
      resetPageIndexOnFiltersChange
    } = this._dataSourceOptions;

    if (paginator && serverPagination) {
      const paginatedData = merge(
        this.paginator.page,
        this._internalPageChanges,
        this.paginator.initialized);
      // Watched for paged data changes and create filters informations.
      this._serverPaginationSubscription.unsubscribe();
      this._serverPaginationSubscription = paginatedData.pipe(takeUntil(this._disconnect))
        .subscribe(() => {
          // noinspection TypeScriptValidateTypes
          this.setFilters([{
            id: pageIndexId,
            value: this.paginator.pageIndex,
            hide: !pageIndexDisplay,
            name: `${pageIndexName}: ${this.paginator.pageIndex}`,
            server: true
          }, {
            id: pageSizeId,
            value: this.paginator.pageSize,
            hide: !pageSizeDisplay,
            name: `${pageSizeName}: ${this.paginator.pageSize}`,
            server: true
          }]);
        });
      this._internalPageChanges.next();
    } else {
      this.removeFilters([pageIndexId, pageSizeId]);
      this._serverPaginationSubscription.unsubscribe();
    }

    if (resetPageIndexOnFiltersChange) {
      this.onFiltersChanges$.subscribe((data) => {
        if (this.paginator.pageIndex > 0 && data?.length > 0) {
          this.paginator.firstPage();
        }
      });
    }
  }

  private _updateCount(value: E[]) {
    const count = value.length ? value.length : 0;
    if (count !== this._count$.getValue()) {
      this._count$.next(count);

      if (this.paginator && !this._dataSourceOptions.serverPagination) {
        this._updatePaginator(count);
      }
    }
  }

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private _pageData(data: E[]) {
    this._updateCount(data);
    if (!this.paginator || this._dataSourceOptions.serverPagination) {
      return data;
    }

    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;

    return data.slice(startIndex, startIndex + this.paginator.pageSize);
  }
}
