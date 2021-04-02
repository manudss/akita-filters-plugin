# Akita Filters Plugins

![npm](https://img.shields.io/npm/v/akita-filters-plugin.svg?style=popout-square) ![npm bundle size](https://img.shields.io/bundlephobia/min/akita-filters-plugin.svg?style=popout-square)
![GitHub last commit](https://img.shields.io/github/last-commit/manudss/akita-filters-plugin.svg?style=popout-square)

![Travis (.org)](https://img.shields.io/travis/manudss/akita-filters-plugin.svg?style=popout-square)

Sometimes, you need to display a list and provide users the ability to filter your list.
Entity-store give the ability to filter, an sorting, by given options to selectAll() function.
But each time, you want to change this filter, you need to recall the function.

Filters plugins give you the possibility to managed multiples filters, add, remove and update filters, and each time filters have been updated, new filtered value has been emitted.

#### Usage
This could be useful, to display :

- products list, (with categories filter, search, price filter, etc...)
- Store locator (with filter by region, location, etc... )
- portfolio, image gallery
- Any list of elements that need multiple filters
- Config filter that could be applied in multiple pages
- ...

#### Advantage :
- Add multiple filters (dynamically add, remove and update filters) without changing data.

- The filters and the entity query could be separated. You could have one component, that displays only your element. Is just make a select, to observe and display all information.
  And have another component to manage all filters.

- You could also display a list of filters, and permit to delete one.

- You could set the order to apply all filters

# Installations

Install the module

```typescript
npm install --save akita-filters-plugin

yarn add akita-filters-plugin
```
npm page : https://www.npmjs.com/package/akita-filters-plugin

# Filters Plugins

## Instantiation

You need to instantiate the filters Plugins :

```typescript
myFilter = new AkitaFiltersPlugin<MyEntitiesState>(this.myEntitiesQuery);
```


-> Give just the entytiesQuery class to the plugins.

You could define it in the constructor of your service, and add it to the property of your service.
```typescript
 constructor(private productsStore: ProductsFiltersStore, private productsQuery: ProductsFiltersQuery, private productsDataService: ProductsFiltersDataService) {
     this.filtersProduct = new AkitaFiltersPlugin<ProductPlantState>(this.productsQuery);
   }
```

You could also extend your class with last AkitaFiltersPlugin, and call the super method. All methods from AkitaFiltersPlugin will be available
```typescript
class CustomService extends AkitaFiltersPlugin<ProductPlantState> {     
      constructor() {
        super(wishQuery, {filtersStoreName: 'CustomFilters'});
      }
   }
```


## Use

To get elements you need to call the function selectAllByFilters() form your filters plugins instance, instead of using the selectAll() function from your Query Class.

```ts
myFilter.selectAllByFilters();
```

Then add filter

```typescript
myFilter.setFilter({
         id: 'category',
         value: 'garden',
         predicate: (value: ProductPlant, index, array) => value.category === category
       });
```

By adding these filters, the data will be filtered, and the new data will be emitted.

Example with Angular, you could add a filter for example with a component like this.

```typescript

@Component({
  selector: 'app-category-filter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div class="col m2 s6">
      <label>Filter Category</label>
      <div class="input-field col s12">
        <select class="browser-default" [formControl]="categoryControl">
          <option value="" disabled selected>Choose your catgory</option>
          <option value="Interior">Interior</option>
          <option value="Garden">Garden</option>
          <option value="Balcony">Balcony</option>
          <option value="Flowers">Flowers</option>
          <option value="Tree">Tree</option>
          <option value="Roses">Roses</option>
        </select>
      </div>
    </div>
  `
})
export class CategoryFiltersComponent {

  categoryControl: new FormControl();
  
  constructor(private productsService: ProductsFiltersService) {}

  ngOnInit() {
    this.getallFiltersValues();

  // On each change, set filters 
    this.categoryControl.valueChanges.pipe(untilDestroyed(this)).subscribe(category => {
      this.productsService.setFilter({
        id: 'category',
        value: category,
        predicate: (value: ProductPlant, index, array) => value.category === category
      });
    });
    
    this.filterForm.controls.sortControl.setValue(this.productsService.getFilterValue('category'), { emitEvent: false }); // emit event false, to not emit value in the above value change subscribe
  } 
}
```

# API

### AkitaFilter type

An Akita filter is an object with the corresponding format :

```typescript
type AkitaFilter: AkitaFilter<EntityState>  = {
   id: ID;
   /** A corresponding name for display the filter, by default, it will be ${id): ${value}  */
   name?: string;
   /** set the order for filter, by default, it is 10 */
   order?: number;
   /** The filter value, this will be used to compute name, or getting the current value, to initiate your form */
   value?: any;
   /** If you want to have filter that is not displayed on the list */
   hide?: boolean;
     /** If you have enabled server filter, specify witch filters will be call to server, default to false. */
     server?: boolean;
   /** The function to apply filters, by default use defaultFilter helpers, that will search the value in the object */
     predicate: ( entity: getEntityType<S>, index: number, array: getEntityType<S>[] | HashMap<getEntityType<S>>, filter: AkitaFilterBase<S> | AkitaFilterLocal<S> | AkitaFilterServer<S> ) => boolean;
     /** add any other data you want to add **/
     [key: string]: any;
 };
```

- Id and function were mandatored. (By default, Id will guid(), and default function, will be defaultFilter helpers).

- But you can set a name, that will be useful to display the filter in the ui. (by default, it will be calculated with ID and value).

- You can set the value, that could be used in your filter function, or retrieve the value for a filter (in ex to init the form filter)

- Or it could be useful, to execute a filter at the begin or the end. (Could be useful to execute simple filter at the beginning, and complex filter like full search at the end)

- hide: true, it will be applied and not displayed in the ui.


# AkitaFilterPlugins API

## Get Entity
###  selectAllByFilters(options?: SelectAllOptions*): Observable<getEntityType<MyEntityState>[] | HashMap<getEntityType<MyEntityState>>>

The main function to subscribe to filtered data. Select All Entity with an apply filter to it, and updated with any change (entity or filter)

You can pass the same options than selectAll Function in EntityQuery.

## Manage filters

### selectFilters(): Observable<AkitaFilter[]>

Select all the filters

Note: filters with hide=true, will not be displayed. If you want it, call directly the filterQuery :

```typescript
this.filterQuery.selectAll()
```

### getFilters(): AkitaFilter[]

Get all the current snapshot filters
Note: filters with hide=true, will not be displayed. If you want it, call directly the filterQuery :
```typescript
this.filterQuery.getAll()
```

### setFilter(filter: Partial<AkitaFilter>)

Create or update a filter (give a Partial AkitaFilter object, all mandatory properties missing will be calculated)

```typescript
filterPlugin.setFilter({
         id: 'fastDelivery',
         name: 'Only fast Delivery',
         value: true,
         order: 1,
         predicate: (value: ProductPlant, index, array) => value.rapidDelivery
       }); 
```

### setFilters(filter: Partial<AkitaFilter>[])

Create or update multiples filters at once (will trigger only one change)


### removeFilter(id: string)

Remove a specified filter by their id name

### removeFilters(id: string[])

Remove multiples filters at once by their id name (will trigger only one change)

### clearFilters()

Remove all filters.

### getFilterValue(id: string): any | null

Get filter value or return null, if value not available.

Usefull to set init a form value, ex:

```typescript
this.filterForm.controls.searchControl.setValue( this.productsService.getFilterValue('search') );
```

## Example to display the filters list

```typescript
@Component({
  selector: 'app-list-filter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div *ngIf="(filters$ | async).length">
    Filter :
  
    <div class="chip" *ngFor="let filter of (filters$ | async)" (click)="removeFilter(filter.id)">
      {{filter.name}}
      <i class="close material-icons">close</i>
    </div>
  
    <a class="waves-effect waves-teal btn-flat" (click)="removeFilterAll()">remove all</a>
  
  </div>
  `
})
export class ListFiltersComponent {

private filters$: Observable<AkitaFilter[]>;
  
  constructor(private productsService: ProductsFiltersService) {}

  ngOnInit() {
    this.filters$ = this.productsService.selectFilters();
  } 
  
   removeFilter(id: any) {
      this.productsService.removeFilter(id);
    }
  
    removeFilterAll() {
      this.productsService.clearFilters();
    }
}
```

## Sorting

You could also set sorting, that will be applied after the filter. Change sorting will also re-emit newly sorted data.

### setSortBy(order: SortByOptions<E>)

set the sort value

### getSortValue(): SortByOptions<E> | null

Retrieve the defined sort value,

## Advanced

All filter is managed by an EntityStore, if you need to do more you could access it and use all standard API

### AkitaFilterPlugins.filterStore

get the filter store, It's an Entity store. Be getting the instance, you could do everything than EntityStore could be done.

### AkitaFilterPlugins.filterQuery

get the Filter Query. To query the list of your filters. Use the API of EntityFilters.

### set the filterStore name.

If you want to use a different filterStore name, you can set it setting params : filtersStoreName when create plugins:
```typescript
myFilter = new AkitaFiltersPlugin<MyEntitiesState>(this.myEntitiesQuery, {filtersStoreName: 'newFiltersName'});
```

By default, the name will, your 'EntityStoreName' concat with 'Filter'


### AkitaFilters set AkitaFiltersStore and AkitaFiltersQuery (version 4.x)

If you want to create an akitaFiltersPlugin by giving the AkitaFiltersStore or AkitaFiltersQuery,
You can specify in constructor params, an existing AkitaFiltersStore or AkitaFiltersQuery.
Useful to create another plugins that use the same Filters store, for exemple to separate your query.
@see issue :  https://github.com/manudss/akita-filters-plugin/issues/10

```typescript
    const myFiltersStore = new AkitaFiltersStore<S>("MyFilters");
    const myFiltersQuery = new AkitaFiltersQuery<S>(filtersStore);

    myFilter = new AkitaFiltersPlugin<MyEntitiesState>(this.myEntitiesQuery, 
    {filtersStore: myFiltersStore, filtersQuery: myFiltersQuery});
```

# Filter helpers Functions

In filter-utils.ts file, there is a helper function, to do some search filters.

## function defaultFilter<E = any>(inElement: E, index: number, array: E[], filter: Filter)

Helper function to do a default filter, that will do a search if the value is the object, or equals otherwise. (only if the filter value is defined)

```typescript
this.filterForm.controls.search.valueChanges.pipe(untilDestroyed(this)).subscribe((search: string) => {
      if (search) {
        this.productsService.setFilter({
          id: 'search',
          value: search,
          order: 20,
          name: `" ${search} "`,

          predicate: defaultFilter);
      } else {
        this.productsService.removeFilter('search');
      }
    });
```

## function searchFilter(searchKey: string, inObj: Object)

Helper function to do a search on all string element

```typescript
this.filterForm.controls.search.valueChanges.pipe(untilDestroyed(this)).subscribe((search: string) => {
      if (search) {
        this.productsService.setFilter({
          id: 'search',
          value: search,
          order: 20,
          name: `" ${search} "`,

          predicate: (value: ProductPlant, index, array) => {
            return searchFilter(search, value);
          }
        });
      } else {
        this.productsService.removeFilter('search');
      }
    });
```

## function searchFilterIn(searchKey: string, inObj: Object, inKey: string)

Helper function to do a search in one string key of an object

```typescript
this.filterForm.controls.search.valueChanges.pipe(untilDestroyed(this)).subscribe((search: string) => {
      if (search) {
        this.productsService.setFilter({
          id: 'search',
          value: search,
          order: 20,
          name: `" ${search} "`,

          predicate: (value: ProductPlant, index, array) => {
            return searchFilterIn(search, value, 'name');
          }
        });
      } else {
        this.productsService.removeFilter('search');
      }
    });
```

### With Server : apply filters from server

Previous options applys all filters locally. But some times, you wants to call filters by making request to server.  
To do this, you need to setWithServer options to your AkitaFiltersPlugin. You will provide a callback function, that will be called everytime a filter changed.
You will make your call, and return this observable. AkitaFiltersPlugin will subscribe to this observable, and add your new data in the store.
An exemple, is available in playground page "photos"

```typescript
myFilter = new AkitaFiltersPlugin<MyEntitiesState>(this.myEntitiesQuery)
.withServer((filtersNormalized: string | HashMap<any>) => 
 {
     return this.httpClient.get({params: filtersNormalized as HashMap<any>}); // make here your pull request to server and return the observable
 });
```
The data will be filtersNormalized that will be returned by getNormalizedFilters().
This function will return all your server filters in a normalized format :

By default return an key value object, with all server filters :
```json
{filter1: 'value 1', filter2: 'value 2'}
```
or if you specify the NormalizedFilterOptions options in `withServer(Callbackfunc, {asQueryParams: true})`

You will have directly a serialized version for your query params:
`filter1=value%201&filter2=value%202`

You can also give some others options :
```typescript
ìnterface NormalizedFilterOptions {
  asQueryParams?: boolean; // display as query params : filter1=value%201&filter2=value%202
  withSort?: boolean; // To include sort : { filter1: 'value 1',
                      //                     filter2: 'value 2',
                      //                     sortBy: 'id',
                      //                     sortByOrder: 'desc' }
                      //  or as query params : filter1=value%201&filter2=value%202&sortBy=id&sortByOrder=desc  
  sortByKey?: string;      // to specify the sortBy key used in previous example, default 'sortBy'                      
  sortByOrderKey?: string; // to specify the sortBy key used in previous example, 'sortByOrder'
                           // will result for example : filter1=value%201&filter2=value%202&_sort=id&_order=desc
} 
```

This will return only all filters that was set as `server = true`.

In your components, you will need to only subecribe to your selectAll() function from your store, to get all new data.

Or you can also combine it with locals filters or sort (if you add some filters with ``server: false`` ). In this case subscribe to selectAllByFilters().



# BONUS: Angular Material Datasource

This specific package is only for Angular Material datatable. But akita filters plugins could be used without angular material. And maybe without angular.
This was released since version 4.x as a subpackage to avoid error, when not using Angular Material.

## Data Connector for Angular Material Table.

For dealing with angular material table, you need to provide a Data Connector.
This connector, help you by just giving the Entity Store. Data Connector, will deal with Akita Filter for you.

Define your data source here :
```typescript
    this.dataSource = new AkitaMatDataSource<EntityState>(EntityQuery);
    this.dataSource.setDefaultSort('colomnName', 'asc');
```

Import it with submodule package :
```typescript
import { AkitaMatDataSource } from 'akita-filters-plugin/datasource';
```

then use it in Mat Data Table like other DataSource.

```angular2html
<table
              mat-table
              #table
              [dataSource]="dataSource"
              [trackBy]="trackByName" 
              matSort
            >...</table>
```

#### Demo

a demo page is available in the playground "angular-material-demo"

#### Dependencies

Need to have installed in your project these api :
"@angular/material": "latest",
"@angular/cdk": "latest"

#### Constructor, use existing AkitaFiltersPlugin

If needed you can specify, an already existing AkitaFiltersPlugins in the constructor. Usefull to share it with another page/components. @see demo : angular-material-demo.
Else, it will create an internal AkitaFiltersPlugins.

```typescript
    this.dataSource = new AkitaMatDataSource<EntityState>(this.productsQuery, this.productsService.filtersProduct);
```

## Function

Then you have some function that you can use for manage filters

### filter/search properties : set search(search: string)

By setting search properties, you set a filter like search.
```typescript
this.dataSource.search = "Search"; 
```
Both use filter and filter, but prefer using search, as filter is so confusing with setFilters functions. (filter is here to be iso functionality, then the MatDataSource)
You can also customize the filter id, if different in your server api

```typescript
    this.dataSource = new AkitaMatDataSource<PhotosState>(this.photosQuery, this.photosService, {
    searchFilterId: 'search', // you can set the id of this filter, usefull if the params is different for you (default : "search")
});
```

### Sort properties :  set sort(sort: MatSort)

By setting Mat Sort for sorting you can set the sort. Used by Mat Table when changing filter

```typescript
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }
```


### Paginator properties :  set paginator(paginator: MatPaginator)

By setting MatPaginator for enable pagination with datasource. Used by Mat Paginator to define pagination

```typescript
@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
```

And add the paginator directly like this in the template. No need to give the size, as it will be setted by the datasource.

```html
    <mat-paginator #paginator
                   [pageIndex]="0"
                   [pageSize]="25"
                   [pageSizeOptions]="[10, 25, 50, 100, 250]">
    </mat-paginator>
```
### Paginator server side :  use server side pagination

By setting MatPaginator (cf before), it will use a local paginator.
You can specify the option : "serverPagination" to use server side pagination. (Need also to set a MatPaginator).
It will subscribe to MatPaginator change page, and create server filter that send the page Number, and page Size.
We will be then notified in withServer callback function.

See exemple in exemple page "photos"

```typescript
    this.dataSource = new AkitaMatDataSource<PhotosState>(this.photosQuery, this.photosService, {
    serverPagination: true, // set to true, to use server side pagination.
    pageIndexId: '_page', // you can set the id of this filter, usefull if the params is different for you (default : "page")
    pageIndexDisplay: true, // Set to true to display page filter (default: false)
    pageIndexName: 'Page', // Set the Name, to you filter, usefull if you want to display the filter : "Name: (value)" (default: "Page")
    pageSizeId: '_limit', // you can set the id of this filter, usefull if the params is different for you (default : "size")
    pageSizeDisplay: true, // Set to true to display size filter (default: false)
    pageSizeName: 'Size', // Set the Name, to you filter, usefull if you want to display the filter : "Name: (value)" (default: "Size")
});
```


But you will need to set the total by your one, depending on how you get this information.

```typescript
    this.dataSource.total = 100; // set the total to Mat Paginator
    console.log('total number', this.dataSource.total); // or get the setted total, was the length setted in Mat Paginator
```




### AkitaFilters properties : get akitaFiltersPlugin(): AkitaFiltersPlugin<EntityState>

Access to the AkitaFilters plugins instance, and use all function from AkitaFilters plugins.
```typescript
this.dataSource.akitaFiltersPlugin.setFilter({
                                     id: 'category',
                                     value: 'garden',
                                     predicate: (value: ProductPlant, index, array) => value.category === category
                                   }); 
```


### setDefaultSort : public setDefaultSort(sortColumun: keyof T, direction: 'asc' | 'desc' = 'asc')

Set the default sort.
```typescript
this.dataSource.setDefaultSort('colomnName', 'asc');
```

### Proxy helper function

Some proxy function, just to call AkitaFilters Plugins.
```typescript
* setFilter(filter: Partial<AkitaFilter< S >>): void; // Create or update a filter. Any mandatory properties, will be added
* setFilters(filter: Partial<AkitaFilter< S >>[]): void; // Create or update multiples filters in one time with emit changes onlu once
* removeFilter(id: ID): void; // Remove a filter by their name
* removeFilters(id: ID[]): void; // Remove multiples filters with emit changes onlu once
* clearFilters(): void; // Remove all filters 
* getFilterValue< S >(id: string): E | null; // Get a filters values 
```
### WithServer : you can also use Akita-Mat-DataSource with server call

You can also use AkitaFilters plugins withServer in Akita-Mat-DataSource by using AkitaFilters Plugins function.
Or there is also a function similar in Akita-Mat-DataSource.




### Breaking Changes : 3.x to 4.x

Akita-mat-data-source is now a subpackage to avoid error with akita-filters-plugin, if you don't use Angular Material.

Changes this
```typescript
import { AkitaMatDataSource } from 'akita-filters-plugin';
```
to
```typescript
import { AkitaMatDataSource } from 'akita-filters-plugin/datasource';
```



### Breaking Changes : 2.x to 3.x

To correspond with Akita, you need now to specify only the entityState. The entity element is calculated as in akita with getEntityType<MyEntitiesState>

Changes this
```typescript
new AkitaFiltersPlugin<MyEntitiesState, MyEntity>()
```
to
```typescript
new AkitaFiltersPlugin<MyEntitiesState>()
```

Changes this
```typescript
AkitaFilter<MyEntitiesState, MyEntity>[]
```
to
```typescript
AkitaFilter<MyEntitiesState>[]
```

Changes this
```typescript
new AkitaMatDataSource<MyEntity, MyEntitiesState>()
```
to
```typescript
new AkitaMatDataSource<MyEntitiesState>()
```
