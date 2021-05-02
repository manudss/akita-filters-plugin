import {EntityState, EntityStore, getEntityType, SortByOptions, StoreConfig} from '@datorama/akita';
import {AkitaFilter, AkitaFilterBase, AkitaFilterLocal, AkitaFilterServer} from './akita-filters.model';

export interface FiltersState<S extends EntityState, E = getEntityType<S>> extends EntityState<AkitaFilterLocal<S> | AkitaFilterServer<S> | AkitaFilterBase<S>> {
  sort: SortByOptions<any>;
}

@StoreConfig({ name: 'filters' })
export class AkitaFiltersStore<S extends EntityState> extends EntityStore<FiltersState<S>, AkitaFilterLocal<S> | AkitaFilterServer<S> | AkitaFilterBase<S>> {
  constructor( storeName: string ) {
    super(undefined, { name: storeName });
  }
}
