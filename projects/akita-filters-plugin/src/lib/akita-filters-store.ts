import {EntityState, EntityStore, getEntityType, SortByOptions, StoreConfig} from '@datorama/akita';
import {AkitaFilter} from './akita-filters.model';

export interface FiltersState<S extends EntityState, E = getEntityType<S>> extends EntityState<AkitaFilter<S, E>> {
  sort: SortByOptions<any>;
}

@StoreConfig({ name: 'filters' })
export class AkitaFiltersStore<S extends EntityState> extends EntityStore<FiltersState<S>, AkitaFilter<S>> {
  constructor( storeName: string ) {
    super(undefined, { name: storeName });
  }
}
