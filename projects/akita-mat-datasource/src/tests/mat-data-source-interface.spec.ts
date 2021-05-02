import {jest} from '@jest/globals';
import {AkitaMatDataSource, MatTableDataSourceInterface} from '../lib';
import {
  createWidget,
  createWidgetCompleted,
  Widget,
  WidgetsQuery,
  WidgetsStore,
  WidgetState
} from '../../../akita-filters-plugin/src/tests/setup';
import {MatSort} from '@angular/material/sort';
import {waitForAsync} from '@angular/core/testing';



const widgetsStore = new WidgetsStore();
const widgetsQuery = new WidgetsQuery(widgetsStore);
const akitaMatDataSource = new AkitaMatDataSource<WidgetState>(widgetsQuery);
const matTableDataSource: MatTableDataSourceInterface<Widget> = akitaMatDataSource;


describe('AkitaMatDataSource as Mat-Table-Datasource', () => {
  jest.setTimeout(10000);

  describe('datasource should be empty when no data or filters', () => {
    it('should be empty', () => {
      expect(matTableDataSource.data).toEqual([]);
      expect(matTableDataSource.filteredData).toEqual([]);
      expect(matTableDataSource.filter).toEqual(null);
      expect(matTableDataSource.paginator).toBeNull();
      expect(matTableDataSource.sort).toBeNull();
    });
  });

  describe('mat table data source with some data ', () => {
    beforeEach(() => {
      widgetsStore.remove();
      akitaMatDataSource.akitaFiltersPlugIn.filtersStore.remove();
      widgetsStore.add([createWidget(1), createWidget(2), createWidget(3), createWidget(4)]);
      // noinspection TypeScriptValidateTypes
      widgetsStore.update(2, {complete: true});
      // noinspection TypeScriptValidateTypes
      widgetsStore.update(3, {complete: true});
    });

    it('should return all data if no filters', () => {
      expect(matTableDataSource.data).toEqual([createWidget(1), createWidgetCompleted(2), createWidgetCompleted(3), createWidget(4)]);
      expect(matTableDataSource.filteredData).toEqual([createWidget(1), createWidgetCompleted(2), createWidgetCompleted(3), createWidget(4)]);
    });

    it('should search if filter is set', () => {
      matTableDataSource.filter = '1';

      expect(matTableDataSource.filter).toEqual('1');
      expect(matTableDataSource.data).toEqual([createWidget(1), createWidgetCompleted(2), createWidgetCompleted(3), createWidget(4)]);
      expect(matTableDataSource.filteredData).toEqual([createWidget(1)]);

    });

    it('should apply 1 filter in filtered Data', () => {
      akitaMatDataSource.setFilter({id: 'filter1', predicate: filter => filter.id % 2 === 1});
      expect(matTableDataSource.filteredData).toEqual([createWidget(1), createWidgetCompleted(3)]);
    });

    it('should apply 2 filter in current order if provided when select all', () => {
      akitaMatDataSource.setFilter({id: 'filter2', predicate: filter => filter.complete});

      expect(matTableDataSource.filteredData).toEqual([createWidgetCompleted(2), createWidgetCompleted(3)]);
    });

    it('should apply 2 filter with specified order if order is specified when get all filtered data', () => {
      akitaMatDataSource.setFilter({id: 'filter1', predicate: filter => filter.id % 2 === 1, order: 2});
      akitaMatDataSource.setFilter({id: 'filter2', predicate: filter => filter.complete, order: 1});

      expect(matTableDataSource.filteredData).toEqual([createWidgetCompleted(3)]);
    });
  });

  describe('Method: filterPredicate', () => {
    beforeEach(() => {
      widgetsStore.remove();
      akitaMatDataSource.akitaFiltersPlugIn.filtersStore.remove();
      widgetsStore.add([createWidget(1), createWidget(2), createWidget(3), createWidget(4)]);
      // noinspection TypeScriptValidateTypes
      widgetsStore.update(2, {complete: true});
      // noinspection TypeScriptValidateTypes
      widgetsStore.update(3, {complete: true});

    });

    it('should be called when filter', () => {
      const spy = jest.spyOn(akitaMatDataSource, 'filterPredicate');
      matTableDataSource.filter = '1';

      expect(matTableDataSource.filteredData).toEqual([createWidget(1)]);
      expect(spy).toHaveBeenCalled();
      // noinspection TypeScriptValidateTypes
      expect(spy).toHaveBeenCalledWith(createWidget(1), '1');
      expect(spy).toHaveBeenCalledWith(createWidgetCompleted(2) as any, '1' as any);
      expect(spy).toHaveBeenCalledWith(createWidgetCompleted(3) as any, '1' as any);
      expect(spy).toHaveBeenCalledWith(createWidget(4) as any, '1' as any);
    });
  });

  describe('sorting function', () => {
    let spySortFunction;
    let spySortingDataAccessor;

    beforeEach(() => {
      widgetsStore.remove();
      akitaMatDataSource.akitaFiltersPlugIn.filtersStore.remove();
      widgetsStore.add([createWidget(1), createWidget(2), createWidget(3), createWidget(4)]);

      spySortFunction = jest.spyOn(akitaMatDataSource, 'sortFunction');
      spySortingDataAccessor = jest.spyOn(akitaMatDataSource, 'sortingDataAccessor');

      matTableDataSource.sort = new MatSort();
    });

    afterEach(() => {
      spySortFunction.mockRestore();
      spySortingDataAccessor.mockRestore();
    });

    xit('should be called when filter', () => {
      matTableDataSource.sort.sort({
        id: 'id',
        start: 'desc',
        disableClear: false,
      });

      expect(matTableDataSource.filteredData).toEqual([createWidget(4), createWidget(3), createWidget(2), createWidget(1)]);
      expect(spySortFunction).toHaveBeenCalled();
      expect(spySortFunction).toHaveBeenCalledTimes(6);
      // noinspection TypeScriptValidateTypes
      expect(spySortFunction).toHaveBeenCalledWith(createWidget(2), createWidget(1), matTableDataSource.sort);
      expect(spySortFunction).toHaveBeenCalledWith(createWidget(3), createWidget(2), matTableDataSource.sort);
      expect(spySortFunction).toHaveBeenCalledWith(createWidget(4), createWidget(3), matTableDataSource.sort);
      expect(spySortFunction).toHaveBeenCalledWith(createWidget(2), createWidget(1), matTableDataSource.sort);
      expect(spySortFunction).toHaveBeenCalledWith(createWidget(3), createWidget(2), matTableDataSource.sort);
      expect(spySortFunction).toHaveBeenCalledWith(createWidget(4), createWidget(3), matTableDataSource.sort);

      expect(spySortingDataAccessor).toHaveBeenCalled();
    });

    xit('should be called when sorting 2 times', () => {

      matTableDataSource.sort.sort({
        id: 'title',
        start: 'desc',
        disableClear: false,
      });

      expect(matTableDataSource.filteredData).toEqual([createWidget(4), createWidget(3), createWidget(2), createWidget(1)]);
      expect(spySortFunction).toHaveBeenCalled();
      expect(spySortFunction).toHaveBeenCalledTimes(6);


      matTableDataSource.sort.sort({
        id: 'title',
        start: 'asc',
        disableClear: false,
      });
      expect(spySortFunction).toHaveBeenCalledTimes(9);
      expect(matTableDataSource.filteredData).toEqual([createWidget(1), createWidget(2), createWidget(3), createWidget(4)]);

      expect(spySortingDataAccessor).toHaveBeenCalled();


    });
  });

  describe('sorting function with custom sortingDataAccessor', () => {
    let spySortFunction;
    let spySortingDataAccessor;

    beforeEach(() => {
      widgetsStore.remove();
      akitaMatDataSource.akitaFiltersPlugIn.filtersStore.remove();
      widgetsStore.add([createWidget(35), createWidget(22), createWidget(53), createWidget(14)]);

      akitaMatDataSource.sortingDataAccessor = (data: T, sortHeaderId: string) => {
        if (sortHeaderId === 'uid') {
          return Math.ceil(data.id / 10);
        }
        if (sortHeaderId === 'mod') {
          return data.id % 10;
        }
        return data[sortHeaderId];
      };
      matTableDataSource.sort = new MatSort();
      spySortFunction = jest.spyOn(akitaMatDataSource, 'sortFunction');
      spySortingDataAccessor = jest.spyOn(akitaMatDataSource, 'sortingDataAccessor');
    });

    afterEach(() => {
      spySortFunction.mockRestore();
      spySortingDataAccessor.mockRestore();
    });

    it('should be called when sorting', () => {

      matTableDataSource.sort.sort({
        id: 'id',
        start: 'desc',
        disableClear: false,
      });

      expect(matTableDataSource.filteredData).toEqual([createWidget(53), createWidget(35), createWidget(22), createWidget(14)]);

      matTableDataSource.sort.sort({
        id: 'mod',
        start: 'asc',
        disableClear: false,
      });
      expect(matTableDataSource.filteredData).toEqual([createWidget(22), createWidget(53), createWidget(14), createWidget(35)]);
    });

    xit('should spySortingDataAccessor return custom data ', () => {

      matTableDataSource.sort.sort({
        id: 'mod',
        start: 'desc',
        disableClear: false,
      });
      expect(matTableDataSource.filteredData).toEqual([createWidget(35), createWidget(14), createWidget(53), createWidget(22)]);
      expect(spySortingDataAccessor.mock.results).toEqual([ { type: 'return', value: 3 },
        { type: 'return', value: 2 },
        { type: 'return', value: 4 },
        { type: 'return', value: 3 },
        { type: 'return', value: 5 },
        { type: 'return', value: 4 },
        { type: 'return', value: 2 },
        { type: 'return', value: 5 },
        { type: 'return', value: 3 },
        { type: 'return', value: 2 },
        { type: 'return', value: 3 },
        { type: 'return', value: 2 },
        { type: 'return', value: 3 },
        { type: 'return', value: 5 },
        { type: 'return', value: 4 },
        { type: 'return', value: 3 },
        { type: 'return', value: 4 },
        { type: 'return', value: 5 } ]);

    });


  });
});
