import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import {ProductPlant, ProductPlantState, ProductsFiltersService} from '../state';
import { untilDestroyed } from 'ngx-take-until-destroy';
import {searchFilter} from '../../../../projects/akita-filters-plugin/src/lib/filters-utils';
import {AkitaFilter} from '../../../../projects/akita-filters-plugin/src/lib/akita-filters.model';

@Component({
  selector: 'app-filters-form',
  templateUrl: './filters-form.component.html'
})
export class FiltersFormComponent implements OnInit, OnDestroy {
  filtersForm = new FormGroup({
    search: new FormControl(),
    sortControl: new FormControl('+title'),
    categoryControl: new FormControl(),
    size: new FormControl(),
    fastDeliveryControl: new FormControl()
  });

  category: string;
  filterFastDelivery: boolean = false;
  public filters$: Observable<AkitaFilter<ProductPlant, ProductPlantState>[]>;
  public nbRefresh: number = 0;

  constructor( private productsService: ProductsFiltersService ) {
  }

  ngOnInit() {
    this.setInitialFilters();

    this.filtersForm.controls.search.valueChanges.pipe(untilDestroyed(this)).subscribe((search: string ) => {
      if ( search ) {
        this.productsService.setFilter({
          id: 'search',
          value: search,
          order: 20,
          name: `" ${search} "`,
          predicate: entity => searchFilter(search, entity)
        });
      } else {
        this.productsService.removeFilter('search');
      }
    });

    this.filtersForm.controls.categoryControl.valueChanges.pipe(untilDestroyed(this)).subscribe(category => {
      this.productsService.setFilter({
        id: 'category',
        value: category,
        predicate: entity => entity.category === category
      });
    });

    this.filtersForm.controls.sortControl.valueChanges.pipe(untilDestroyed(this)).subscribe((sortBy: string ) => {
      this.productsService.setOrderBy(sortBy.slice(1), sortBy.slice(0, 1));
    });
    this.filtersForm.controls.sortControl.setValue(this.productsService.getSortValue());

    this.filterFastDelivery = this.productsService.getFilterValue('fastDelivery');

    this.filters$ = this.productsService.selectFilters();
  }

  private setInitialFilters() {
    this.filtersForm.setValue({
      search: this.productsService.getFilterValue('search'),
      sortControl: this.productsService.getSortValue(),
      categoryControl: this.productsService.getFilterValue('category'),
      size: this.productsService.getFilterValue('size'),
      fastDeliveryControl: this.productsService.getFilterValue('fastDelivery')
    }, { emitEvent: false });
  }

  getNormalizedFilters() {
    console.log(this.productsService.filtersProduct.getNormalizedFilters({ withSort: true, asQueryParams: true }));
  }

  filterSize( size: string ) {
    this.productsService.setFilter({
      id: 'size',
      name: `${size} size`,
      value: size,
      predicate: entity => entity.size === size
    });
  }

  changeFastDelivery() {
    this.filterFastDelivery = !this.filterFastDelivery;
    if( this.filterFastDelivery ) {
      this.productsService.setFilter({
        id: 'fastDelivery',
        name: 'Only fast Delivery',
        value: this.filterFastDelivery,
        order: 1,
        predicate: entity => entity.rapidDelivery
      });
    } else {
      this.removeFilter('fastDelivery');
    }
  }

  removeFilter( id: any ) {
    this.productsService.removeFilter(id);
    this.setInitialFilters();
  }

  removeFilterAll() {
    this.productsService.removeAllFilter();
    this.setInitialFilters();
  }

  ngOnDestroy() {
  }

  refresh() {
    this.nbRefresh = this.productsService.filtersProduct.refresh();
  }
}
