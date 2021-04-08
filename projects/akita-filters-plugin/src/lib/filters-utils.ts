
import {isDefined, isString, isObject, HashMap, getEntityType, isArray} from '@datorama/akita';
import { AkitaFilterBase} from './akita-filters.model';

/**
 * Helper function to do a default filter
 */
export function defaultFilter<E = any, S = any>(
  value: E | getEntityType<S>,
  index: number, array: E[] | HashMap<getEntityType<E>>,
  filter: Partial<AkitaFilterBase<E, S>> ): boolean {
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
export function searchFilterIn( searchKey: string, inObj: Object, inKey: string ): boolean {
  return  isString(searchKey)
    && isString(inKey)
    && isString(inObj[inKey])
    && inObj[inKey].toLocaleLowerCase().includes(searchKey.toLocaleLowerCase());
}


/**
 * Function to compare changes between two AkitaFilters arrays
 */
export function compareFiltersArray<S = any>(x: Array<AkitaFilterBase<S>>, y: Array<AkitaFilterBase<S>>) {
  if (!x && !y) { return true; }
  if (!x || !y || x.length !== y.length) { return false; }
  return !x.some((filterX) => {
    const find = y.find(filterY => filterY.id === filterX.id);
    return !(find && find.value === filterX.value);
  });
}

export const getCompareFilters = (): Function => {
  return compareFiltersArray;
};

