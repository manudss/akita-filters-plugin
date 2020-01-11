import { AkitaFilter, FiltersState, AkitaFiltersStore } from './akita-filters-store';
import {EntityState, getEntityType, Order, QueryConfig, QueryEntity} from '@datorama/akita';


@QueryConfig({
  sortBy: 'order',
  sortByOrder: Order.ASC
})
export class AkitaFiltersQuery<S extends EntityState> extends QueryEntity<FiltersState<S>, AkitaFilter<S>, string> {
  constructor(protected store: AkitaFiltersStore<S>) {
    super(store);
  }
}
