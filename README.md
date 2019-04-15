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
npm install --save akita-filters-plugins

yarn add akita-filters-plugins
```
npm page : https://www.npmjs.com/package/akita-filters-plugin

# Filters Plugins 

## Instantiation 

You need to instanciate the filters Plugins : 

```typescript
myFilter = new AkitaFiltersPlugin<MyEntitiesState, MyEntity>(this.myEntitiesQuery);
```


-> Give just the entytiesQuery class to the plugins. 

You could define it in the constructor of your service, and add it to the property of your service. 
```typescript
 constructor(private productsStore: ProductsFiltersStore, private productsQuery: ProductsFiltersQuery, private productsDataService: ProductsFiltersDataService) {
     this.filtersProduct = new AkitaFiltersPlugin<ProductPlantState, ProductPlant>(this.productsQuery);
   }
```

You could also extend your class with last AkitaFiltersPlugin, and call the super method. All methods from AkitaFiltersPlugin will be available 
```typescript
class CustomService extends AkitaFiltersPlugin {     
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
type AkitaFilter  = {
   id: ID;
   /** A corresponding name for display the filter, by default, it will be ${id): ${value}  */
   name?: string;
   /** set the order for filter, by default, it is 10 */
   order?: number;
   /** The filter value, this will be used to compute name, or getting the current value, to initiate your form */
   value?: any;
   /** If you want to have filter that is not displayed on the list */
   hide?: boolean;
   /** The function to apply filters, by default use defaultFilter helpers, that will search the value in the object */
   predicate: (value: any, index: number, array: any[], filter: AkitaFilter) => any;
 };
 ```
 
 - Id and function were mandatored. (By default, Id will guid(), and default function, will be defaultFilter helpers). 
 
 - But you can set a name, that will be useful to display the filter in the ui. (by default, it will be calculated with ID and value).
 
 - You can set the value, that could be used in your filter function, or retrieve the value for a filter (in ex to init the form filter)
 
 - Or it could be useful, to execute a filter at the begin or the end. (Could be useful to execute simple filter at the beginning, and complex filter like full search at the end)
 
 - hide: true, it will be applied and not displayed in the ui. 
 

# AkitaFilterPlugins API

## Get Entity 
### selectAllByFilters(options: SelectOptions<E> = {}): Observable<E[]>

The main function to subscribe to filtered data. Select All Entity with an apply filter to it, and updated with any change (entity or filter)

You can pass the same options than selectAll Function in EntityQuery. 

## Manage filters 

### selectFilters(): Observable<AkitaFilter[]>
 
 Select all the filters
  
   Note: filters with hide=true, will not be displayed. If you want it, call directly the filterQuery :
   ```ts
this.filterQuery.selectAll()
```
   
### getFilters(): AkitaFilter[]

Get all the current snapshot filters
 Note: filters with hide=true, will not be displayed. If you want it, call directly the filterQuery :
```typescript
this.filterQuery.getAll()
```

### setFilter(filter: Partial<AkitaFilter>)

Create or update a filter (give a Partial AkitaFilter object)

```typescript
filterPlugin.setFilter({
         id: 'fastDelivery',
         name: 'Only fast Delivery',
         value: true,
         order: 1,
         predicate: (value: ProductPlant, index, array) => value.rapidDelivery
       });
       
```

### removeFilter(id: string)

Remove a specified filter. 

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
myFilter = new AkitaFiltersPlugin<MyEntitiesState, MyEntity>(this.myEntitiesQuery, {filtersStoreName: 'newFiltersName'});
```

By default, the name will, your 'EntityStoreName' concat with 'Filter'

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



