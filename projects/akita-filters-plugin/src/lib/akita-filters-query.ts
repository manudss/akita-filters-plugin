import { FiltersState, AkitaFiltersStore } from './akita-filters-store';
import {EntityState, Order, QueryConfig, QueryEntity} from '@datorama/akita';
import {AkitaFilterBase, AkitaFilterLocal, AkitaFilterServer} from './akita-filters.model';


@QueryConfig({
  sortBy: 'order',
  sortByOrder: Order.ASC
})
export class AkitaFiltersQuery<S extends EntityState>
  extends QueryEntity<FiltersState<S>, AkitaFilterBase<S> | AkitaFilterLocal<S> | AkitaFilterServer<S>, string> {
  constructor(protected store: AkitaFiltersStore<S>) {
    super(store);
  }
}
