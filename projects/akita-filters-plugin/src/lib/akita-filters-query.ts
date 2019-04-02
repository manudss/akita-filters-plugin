import { AkitaFilter, FiltersState, AkitaFiltersStore } from './akita-filters-store';
import {Order, QueryConfig, QueryEntity} from '@datorama/akita';


@QueryConfig({
  sortBy: 'order',
  sortByOrder: Order.ASC
})
export class AkitaFiltersQuery<E> extends QueryEntity<FiltersState<E>, AkitaFilter<E>, string> {
  constructor(protected store: AkitaFiltersStore<E>) {
    super(store);
  }
}
