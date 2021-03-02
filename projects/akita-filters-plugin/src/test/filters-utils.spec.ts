import {AkitaFilter, compareFiltersArray, createFilter, defaultFilter} from '../lib/index';

describe('Filters-utils :', () => {
  describe('Compare Filters Array to find if their is equals', () => {
    let filter1: AkitaFilter<any>, filter2: AkitaFilter<any>, filter3: AkitaFilter<any>, filter4: AkitaFilter<any>;

    beforeEach(() => {
      filter1 = createFilter({
        predicate: defaultFilter, id: 'filter1', name: 'Filter 1', value: 'aaa'});

      filter2 = createFilter({
        predicate: defaultFilter, id: 'filter2', name: 'Filter 2', value: 'bbb'});

      filter3 = createFilter({
        predicate: defaultFilter, id: 'filter3', name: 'Filter 3', value: 12});

      filter4 = createFilter({
        predicate: defaultFilter, id: 'filter4', name: 'Filter 4', value: 'aaa'});
    });

    it('should empty or null be equals', () => {
      expect(compareFiltersArray([], [])).toEqual(true);
      expect(compareFiltersArray(null, null)).toEqual(true);
      expect(compareFiltersArray(undefined, undefined)).toEqual(true);
    });

    it('should be false if one is null', () => {
      expect(compareFiltersArray([], null)).toEqual(false);
      expect(compareFiltersArray(null, [])).toEqual(false);
      expect(compareFiltersArray(null, [filter1])).toEqual(false);
      expect(compareFiltersArray([filter1, filter2], null)).toEqual(false);
      expect(compareFiltersArray([], undefined)).toEqual(false);
      expect(compareFiltersArray(undefined, [])).toEqual(false);
      expect(compareFiltersArray(undefined, [filter1])).toEqual(false);
      expect(compareFiltersArray([filter1, filter2], undefined)).toEqual(false);
    });

    it('should be different if two array have different size', () => {
      expect(compareFiltersArray([filter1], [])).toEqual(false);
      expect(compareFiltersArray([], [filter1])).toEqual(false);
      expect(compareFiltersArray([filter1, filter2], [filter1])).toEqual(false);
      expect(compareFiltersArray([], [filter2, filter1, filter4, filter3])).toEqual(false);
      expect(compareFiltersArray([filter2, filter1], [filter2, filter1, filter4, filter3])).toEqual(false);
    });

    it('should be equals if same object was present in two array', () => {
      expect(compareFiltersArray([filter1], [filter1])).toEqual(true);
      expect(compareFiltersArray([filter2], [filter2])).toEqual(true);
      expect(compareFiltersArray([{hide: false,
      id: 'search',
      name: 'ali',
      order: 10,
      predicate: () => true,
      server: true,
      value: 'ali'}], [{hide: false,
        id: 'search',
        name: 'ali',
        order: 10,
        predicate: () => false,
        server: true,
        value: 'ali'}])).toEqual(true);
      expect(compareFiltersArray([filter1, filter2], [filter2, filter1])).toEqual(true);
      expect(compareFiltersArray([filter1, filter2, filter3, filter4], [filter2, filter1, filter4, filter3])).toEqual(true);
    });

    it('should return false if two object was different', () => {
      expect(compareFiltersArray([filter1], [filter2])).toEqual(false);
      expect(compareFiltersArray([filter3], [filter4])).toEqual(false);
      expect(compareFiltersArray([filter1], [filter4])).toEqual(false);
      expect(compareFiltersArray([filter1, filter2], [filter3, filter4])).toEqual(false);
    });

    it('should return false if same object has changed', () => {
      expect(compareFiltersArray([filter1], [{...filter1, value: 'bbb'}])).toEqual(false);
      expect(compareFiltersArray([filter3], [{...filter3, value: 8}])).toEqual(false);
      expect(compareFiltersArray([filter1, filter2], [filter2, {...filter1, value: 'bbb'}])).toEqual(false);
      expect(compareFiltersArray([filter1, filter2, filter3, filter4],
        [{...filter2, value: 0}, {...filter1, value: 'bbb'}, {...filter4, value: 12}, {...filter3, value: 'aaa'}])).toEqual(false);
    });

    it('should return false if object id was different', () => {
      expect(compareFiltersArray([filter1], [filter4])).toEqual(false);
      expect(compareFiltersArray([filter3], [{...filter3, id: 'filter1'}])).toEqual(false);
      expect(compareFiltersArray([filter1, filter2], [filter2, {...filter1, value: 'bbb'}])).toEqual(false);
    });

    it('should return true if object has changed on other properties', () => {
      expect(compareFiltersArray([filter1], [{...filter1, name: 'bbb'}])).toEqual(true);
      expect(compareFiltersArray([filter3], [{...filter3, predicate: null}])).toEqual(true);
      expect(compareFiltersArray([filter1, filter2], [filter2, {...filter1, name: 'bbb'}])).toEqual(true);
      expect(compareFiltersArray([filter1, filter2, filter3, filter4],
        [{...filter2, server: true}, {...filter1, order: 100}, {...filter4, hide: true}, {...filter3, name: 'aaa'}])).toEqual(true);
    });

  });
});
