import {EntityState, getEntityType, guid, HashMap, ID} from '@datorama/akita';
import {defaultFilter} from './filters-utils';

function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.substr(1);
}

export interface AkitaFilterBase<S extends EntityState, E = getEntityType<S>> {
    id: ID;
    /** A corresponding name for display the filter, by default, it will be ${id): ${value}  */
    name?: string;
    /** set the order for filter, by default, it is 10 */
    order?: number;
    /** If you want to have filter that is not displayed on the list */
    hide?: boolean;
    /** The filter value, this will be used to compute name, or getting the current value, to initiate your form */
    value?: any;
}

export interface AkitaFilterLocal<S extends EntityState, E = getEntityType<S>> extends AkitaFilterBase<S, E> {
  /** If you have enabled server filter, specify witch filters will be call to server, default to false. */
  server?: false;
  /** The function to apply filters, by default use defaultFilter helpers, that will search the value in the object */
  predicate: (entity: E, index: number, array: E[] | HashMap<E>, filter: AkitaFilter<S>) => boolean;
}

export interface AkitaFilterServer<S extends EntityState, E = getEntityType<S>> extends AkitaFilterBase<S, E> {
  /** If you have enabled server filter, specify witch filters will be call to server, default to false. */
  server: true;
  /** The filter value will be sent to withServer function */
  value: any;
}

export type AkitaFilter<S extends EntityState, E = getEntityType<S>> = AkitaFilterLocal<S, E> | AkitaFilterServer<S, E> | {
  /** add any other data you want to add, keep this to get the compatibilities with others versions **/
  [key: string]: any;
};

export function createFilter<S extends EntityState, E = getEntityType<S>>
  (filterParams: Partial<AkitaFilterLocal<S> | AkitaFilterServer<S>>) {
    const id = filterParams.id ? filterParams.id : guid();
    const name = filterParams.name || (filterParams.value && filterParams.id ?
        `${capitalize(filterParams.id.toString())}: ${filterParams.value.toString()}` : undefined);

    if (!(filterParams as AkitaFilterLocal<S>)?.predicate && filterParams.value && !filterParams.server) {
        /** use default function, if not provided */
        // @ts-ignore
        (filterParams as AkitaFilterLocal<S>).predicate = defaultFilter;
    }

    return {id, name, hide: false, order: 10, server: false, ...filterParams} as AkitaFilter<S>;
}
