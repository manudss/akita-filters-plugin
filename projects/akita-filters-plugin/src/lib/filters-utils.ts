
import {isDefined, isString, isObject, HashMap, getEntityType} from '@datorama/akita';
import {AkitaFilter} from './akita-filters-store';

/**
 * Helper function to do a default filter
 */
export function defaultFilter<E = any, S = any>(
  value: E | getEntityType<S>,
  index: number, array: E[] | HashMap<getEntityType<E>>,
  filter: AkitaFilter<E, S> ): boolean {
  if ( isObject(value) && isString(filter.value) ) {
    return searchFilter(filter.value, value);
  }
  return isDefined(filter.value) ? filter.value === value : !!value;
}

/**
 * Helper function to do search on all string element
 */
export function searchFilter( searchKey: string, inObj: Object ): boolean {
  return isString(searchKey)  && Object.keys(inObj).some(function( key ) {
    return isString(inObj[key]) && inObj[key].toLocaleLowerCase().includes(searchKey.toLocaleLowerCase());
  });
}

/**
 * Helper function to do search in one key of an object
 */
export function searchFilterIn<T = Object>( searchKey: string, inObj: T, inKey: keyof T ): boolean {
  return  isString(searchKey)
    && isString(inKey)
    && isString(inObj[inKey])
    && inObj[inKey].toLocaleLowerCase().includes(searchKey.toLocaleLowerCase());
}
