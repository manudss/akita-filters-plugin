import { skip, take } from 'rxjs/operators';

import {Order} from '@datorama/akita';
import {jest} from '@jest/globals'
import {of} from 'rxjs';
import Mock = jest.Mock;
import {AkitaMatDataSource} from '../lib';
import {createWidget, createWidgetCompleted, WidgetsQuery, WidgetsStore} from '../../../akita-filters-plugin/src/tests/setup';
import { MatSort } from '@angular/material/sort';


const widgetsStore = new WidgetsStore();
const widgetsQuery = new WidgetsQuery(widgetsStore);
const akitaMatDataSource = new AkitaMatDataSource(widgetsQuery);


describe('AkitaMatDataSource', () => {

 describe('Manages Filters', () => {
    describe('Filters', () => {
      beforeEach(() => {
        widgetsStore.remove();

        akitaMatDataSource.setFilter({ id: 'filter1', predicate: filter => filter.id % 2 === 0 });
        akitaMatDataSource.setFilter({ id: 'filter2', predicate: filter => !!filter });
        akitaMatDataSource.setFilter({ id: 'filter3', predicate: filter => !!!filter });
      });

      it('should take all filters by default', () => {
        expect(akitaMatDataSource.akitaFiltersPlugIn.filtersQuery.getCount()).toEqual(3);
        expect(akitaMatDataSource.akitaFiltersPlugIn.filtersQuery.hasEntity('filter1')).toEqual(true);
        expect(akitaMatDataSource.akitaFiltersPlugIn.filtersQuery.hasEntity('filter2')).toEqual(true);
        expect(akitaMatDataSource.akitaFiltersPlugIn.filtersQuery.hasEntity('filter3')).toEqual(true);
      });

      it('should add filter if not exist with all default values', () => {
        akitaMatDataSource.setFilter({ id: 'filter4', predicate: filter => filter.id });
        expect(akitaMatDataSource.akitaFiltersPlugIn.filtersQuery.getCount()).toEqual(4);
        expect(akitaMatDataSource.akitaFiltersPlugIn.filtersQuery.getEntity('filter4').id).toEqual('filter4');
        expect(akitaMatDataSource.akitaFiltersPlugIn.filtersQuery.getEntity('filter4').hide).toEqual(false);
        expect(akitaMatDataSource.akitaFiltersPlugIn.filtersQuery.getEntity('filter4').name).toBeUndefined();
        expect(akitaMatDataSource.akitaFiltersPlugIn.filtersQuery.getEntity('filter4').order).toEqual(10);
      });

      it('should update filter if exist with new value', () => {
        akitaMatDataSource.setFilter({ id: 'filter3', hide: true, name: 'Filter 3', order: 2 });
        expect(akitaMatDataSource.akitaFiltersPlugIn.filtersQuery.getCount()).toEqual(4);
        expect(akitaMatDataSource.akitaFiltersPlugIn.filtersQuery.getEntity('filter3').id).toEqual('filter3');
        expect(akitaMatDataSource.akitaFiltersPlugIn.filtersQuery.getEntity('filter3').hide).toEqual(true);
        expect(akitaMatDataSource.akitaFiltersPlugIn.filtersQuery.getEntity('filter3').name).toEqual('Filter 3');
        expect(akitaMatDataSource.akitaFiltersPlugIn.filtersQuery.getEntity('filter3').order).toEqual(2);

        akitaMatDataSource.setFilter({ id: 'filter2', value: 'aaaa' });
        expect(akitaMatDataSource.akitaFiltersPlugIn.filtersQuery.getEntity('filter2').value).toEqual('aaaa');
        expect(akitaMatDataSource.akitaFiltersPlugIn.filtersQuery.getEntity('filter2').name).toEqual('Filter2: aaaa');
      });

      it('should remove filter 2', () => {
        akitaMatDataSource.removeFilter('filter2');
        expect(akitaMatDataSource.akitaFiltersPlugIn.filtersQuery.getCount()).toEqual(3);
        expect(akitaMatDataSource.akitaFiltersPlugIn.filtersQuery.hasEntity('filter1')).toEqual(true);
        expect(akitaMatDataSource.akitaFiltersPlugIn.filtersQuery.hasEntity('filter2')).toEqual(false);
        expect(akitaMatDataSource.akitaFiltersPlugIn.filtersQuery.hasEntity('filter3')).toEqual(true);
      });

      it('should set / get value  ', () => {
        akitaMatDataSource.setFilter({ id: 'filter1', value: true });
        akitaMatDataSource.setFilter({ id: 'filter2', value: 'aaaa' });
        expect(akitaMatDataSource.akitaFiltersPlugIn.filtersQuery.getEntity('filter1').value).toEqual(true);
        expect(akitaMatDataSource.getFilterValue('filter1')).toEqual(true);

        expect(akitaMatDataSource.akitaFiltersPlugIn.filtersQuery.getEntity('filter2').value).toEqual('aaaa');
        expect(akitaMatDataSource.getFilterValue('filter2')).toEqual('aaaa');

        expect(akitaMatDataSource.akitaFiltersPlugIn.filtersQuery.getEntity('filter3').value).toBeUndefined();
        expect(akitaMatDataSource.getFilterValue('filter3')).toBeNull();
      });

      it('should call getFilters() and get only filters not hidden ', () => {
        akitaMatDataSource.setFilter({ id: 'filter2', hide: true });
        const filtersAll = akitaMatDataSource.akitaFiltersPlugIn.getFilters();

        expect(filtersAll[0].id).toEqual('filter1');
        expect(filtersAll[1].id).toEqual('filter3');
      });
    });
    describe('SelectAll with Filters ', () => {
      beforeEach(() => {
        widgetsStore.remove();
        akitaMatDataSource.akitaFiltersPlugIn.filtersStore.remove();
        widgetsStore.add([createWidget(1), createWidget(2), createWidget(3), createWidget(4)]);
        widgetsStore.update(2, { complete: true });
        widgetsStore.update(3, { complete: true });
      });

      it('should select all if no filters', () => {
        akitaMatDataSource
          .connect()
          .pipe(take(1))
          .subscribe(result => {
            expect(Array.isArray(result)).toBeTruthy();
            expect(result.length).toEqual(4);
            expect(result[0].id).toEqual(1);
            expect(result[1].id).toEqual(2);
            expect(result[2].id).toEqual(3);
            expect(result[3].id).toEqual(4);
          });
      });

      it('should apply filter if provided when select all', () => {
        akitaMatDataSource.setFilter({ id: 'filter1', predicate: filter => filter.id % 2 === 1 });

        akitaMatDataSource
          .connect()
          .pipe(take(1))
          .subscribe(result => {
            expect(Array.isArray(result)).toBeTruthy();
            expect(result.length).toEqual(2);
            expect(result[0].id).toEqual(1);
            expect(result[1].id).toEqual(3);
          });
      });

      it('should apply 2 filter if provided when select all', () => {
        akitaMatDataSource.setFilter({ id: 'filter1', predicate: filter => filter.id % 2 === 1 });
        akitaMatDataSource.setFilter({ id: 'filter2', predicate: filter => filter.complete });

        akitaMatDataSource
          .connect()
          .pipe(take(1))
          .subscribe(result1 => {
            expect(Array.isArray(result1)).toBeTruthy();
            expect(result1.length).toEqual(1);
            expect(result1[0].id).toEqual(3);
          });
      });

      it('should apply 2 filter in current order if provided when select all', () => {
        akitaMatDataSource.setFilter({ id: 'filter2', predicate: filter => filter.complete });
        akitaMatDataSource.setFilter({ id: 'filter1', predicate: filter => filter.id % 2 === 1 });

        akitaMatDataSource
          .connect()
          .pipe(take(1))
          .subscribe(result2 => {
            expect(Array.isArray(result2)).toBeTruthy();
            expect(result2.length).toEqual(1);
            expect(result2[0].id).toEqual(3);

          });
      });

      it('should apply 2 filter with specified order if order is specified when select all', () => {
        akitaMatDataSource.setFilter({ id: 'filter1', predicate: filter => filter.id % 2 === 1, order: 2 });
        akitaMatDataSource.setFilter({ id: 'filter2', predicate: filter => filter.complete, order: 1 });

        akitaMatDataSource
          .connect()
          .pipe(take(1))
          .subscribe(result2 => {
            expect(Array.isArray(result2)).toBeTruthy();
            expect(result2.length).toEqual(1);
            expect(result2[0].id).toEqual(3);
          });
      });
    });

    describe('SelectAll when any change in filter, or entities', () => {
      jest.useFakeTimers();

      beforeEach(() => {
        widgetsStore.remove();
        akitaMatDataSource.akitaFiltersPlugIn.filtersStore.remove();
        widgetsStore.add([createWidget(1), createWidgetCompleted(2), createWidgetCompleted(3), createWidget(4)]);
      });

      it('should call set filter must send a new value', done3 => {
        jest.setTimeout(2000);
        const count = 0;
        akitaMatDataSource
          .connect()
          .pipe(
            skip(1),
            take(1)
          )
          .subscribe(result2 => {
            expect(Array.isArray(result2)).toBeTruthy();
            expect(result2.length).toEqual(2);
            expect(result2[0].id).toEqual(2);
            expect(result2[1].id).toEqual(3);

            done3();
          });

        jest.runAllTimers();
        akitaMatDataSource.setFilter({ id: 'filter2', predicate: filter => filter.complete });
        jest.runAllTimers();
      });

      it('should send a new value when add new entity', done3 => {
        jest.setTimeout(3000);
        const count = 0;
        akitaMatDataSource.setFilter({ id: 'filter2', predicate: filter => filter.complete });

        akitaMatDataSource
          .connect()
          .pipe(
            skip(1),
            take(1)
          )
          .subscribe(result2 => {
            expect(Array.isArray(result2)).toBeTruthy();
            expect(result2.length).toEqual(3);
            expect(result2[0].id).toEqual(2);
            expect(result2[1].id).toEqual(3);
            expect(result2[2].id).toEqual(6);

            done3();
          });

        jest.runAllTimers();
        widgetsStore.add(createWidgetCompleted(6));
        jest.runAllTimers();
      });
    });

    describe('SelectALL with Sort ', () => {
      jest.useFakeTimers();

      beforeEach(() => {
        widgetsStore.remove();
        akitaMatDataSource.akitaFiltersPlugIn.filtersStore.remove();
        widgetsStore.add([createWidget(1), createWidget(2), createWidget(3), createWidget(4)]);
        widgetsStore.update(2, { complete: true });
        widgetsStore.update(3, { complete: true });
      });

      it('should not sort if no sort specified', () => {
        akitaMatDataSource
          .connect()
          .pipe(take(1))
          .subscribe(result => {
            expect(Array.isArray(result)).toBeTruthy();
            expect(result.length).toEqual(4);
            expect(result[0].id).toEqual(1);
            expect(result[1].id).toEqual(2);
            expect(result[2].id).toEqual(3);
            expect(result[3].id).toEqual(4);
          });
      });

      it('should apply sort if provided in other sens', () => {
        jest.setTimeout(1000);

        akitaMatDataSource.sort = new MatSort();
        jest.runAllTimers();

        akitaMatDataSource
          .connect()
          .pipe(take(1))
          .subscribe(result => {
            expect(Array.isArray(result)).toBeTruthy();
            expect(result.length).toEqual(4);
            expect(result[0].id).toEqual(4);
            expect(result[1].id).toEqual(3);
            expect(result[2].id).toEqual(2);
            expect(result[3].id).toEqual(1);
          });
      });

      it('should apply filter and sort', () => {
        akitaMatDataSource.akitaFiltersPlugIn.setSortBy({ sortBy: 'id', sortByOrder: Order.DESC });
        akitaMatDataSource.setFilter({ id: 'filter1', predicate: filter => filter.id % 2 === 1 });

        akitaMatDataSource
          .connect()
          .pipe(take(1))
          .subscribe(result => {
            expect(Array.isArray(result)).toBeTruthy();
            expect(result.length).toEqual(2);
            expect(result[0].id).toEqual(3);
            expect(result[1].id).toEqual(1);
          });
      });
    });


    describe('WithServer Feature : SelectAll when any change in filter, or entities', () => {
      jest.useFakeTimers();

      beforeEach(() => {
        widgetsStore.remove();
        akitaMatDataSource.akitaFiltersPlugIn.filtersStore.remove();
        widgetsStore.add([createWidget(1), createWidgetCompleted(2), createWidgetCompleted(3), createWidget(4)]);
      });

      describe('METHOD : withServer()', () => {
        let filtersQuery;
        let withServerFunc;
        let filtersWithServer;

        beforeEach(() => {
          filtersQuery = {selectAll: jest.fn().mockReturnValue(of([])), select: jest.fn(), selectAllByFilters: jest.fn(), selectSortBy: jest.fn(), getAll: jest.fn()};
          withServerFunc = jest.fn();
          // @ts-ignore , {filtersQuery}
          filtersWithServer = new AkitaMatDataSource(widgetsQuery);
          filtersWithServer.selectSortBy = jest.fn();
        });

        it('expected initialCall', () => {
          filtersWithServer.withServer(withServerFunc);
          expect(filtersWithServer.hasServer()).toEqual(true);
          expect(withServerFunc).toHaveBeenCalledTimes(1);
          expect(withServerFunc).toHaveBeenCalledWith({});
        });

        it('expected initialCall with sort', () => {

          filtersWithServer.withServer(withServerFunc, {withSort: true});
          expect(filtersWithServer.hasServer()).toEqual(true);
          expect(withServerFunc).toHaveBeenCalledTimes(1);
        });

      });

      describe('METHOD : withServer() should calls withServerFunc', () => {
        let withServerFunc: Mock;
        let filtersWithServer;
        let storeSet: {set: Mock};

        beforeEach(() => {
          withServerFunc = jest.fn();
          // @ts-ignore
          filtersWithServer = new AkitaMatDataSource(widgetsQuery);
          storeSet = {set: jest.fn()};
          filtersWithServer.akitaFiltersPlugIn.getStore = jest.fn().mockReturnValue(storeSet);
        });

        it('must call withServerFunc each time some filters has been added or removed', () => {
          filtersWithServer.withServer(withServerFunc);
          expect(withServerFunc).toHaveBeenCalledTimes(1);
          expect(withServerFunc).toHaveBeenCalledWith({});
          filtersWithServer.setFilter({ id: 'filter1', value: true, server: true });
          filtersWithServer.setFilter({ id: 'filter2', value: 'aaaa', server: false });
          filtersWithServer.setFilter({ id: 'filter3', value: 'bbb', server: true });
          expect(withServerFunc).toHaveBeenCalledTimes(3);
          expect(withServerFunc).toHaveBeenNthCalledWith(2, {'filter1': true});
          expect(withServerFunc).toHaveBeenNthCalledWith(3,  {'filter1': true,  'filter3': 'bbb'});
          filtersWithServer.setFilter({ id: 'filter3', value: 'ccc', server: true });
          expect(withServerFunc).toHaveBeenCalledTimes(4);
          expect(withServerFunc).toHaveBeenNthCalledWith(4,  {'filter1': true,  'filter3': 'ccc'});
          filtersWithServer.removeFilter('filter3');
          expect(withServerFunc).toHaveBeenCalledTimes(5);
          expect(withServerFunc).toHaveBeenNthCalledWith(5,  {'filter1': true});
        });

        it('must call set store function each time some returns', () => {
          filtersWithServer.withServer(withServerFunc);
          withServerFunc.mockReturnValueOnce(of([createWidget(1), createWidget(2), createWidgetCompleted(3)]))
             .mockReturnValueOnce(of([createWidget(1), createWidget(2)]))
             .mockReturnValueOnce(of([createWidget(1), createWidget(2), createWidgetCompleted(3)]))
            .mockReturnValueOnce(false)
            .mockName('withServerFunc');
          expect(storeSet.set).toHaveBeenCalledTimes(0);
          filtersWithServer.setFilter({ id: 'filter1', value: true, server: true });
          expect(storeSet.set).toHaveBeenCalledTimes(1);
          expect(storeSet.set.mock.calls[0]).toEqual([
            [
              { complete: false, id: 1, title: 'Widget 1' },
              { complete: false, id: 2, title: 'Widget 2' },
              { complete: true, id: 3, title: 'Widget 3' }
            ]
          ]);
          filtersWithServer.setFilter({ id: 'filter3', value: 'ccc', server: true });
          expect(storeSet.set).toHaveBeenCalledTimes(2);
          expect(storeSet.set.mock.calls[1]).toEqual([
            [
              { complete: false, id: 1, title: 'Widget 1' },
              { complete: false, id: 2, title: 'Widget 2' }
            ]
          ]);
          filtersWithServer.removeFilter('filter3');
          expect(storeSet.set).toHaveBeenCalledTimes(3);
          expect(storeSet.set.mock.calls[2]).toEqual([
            [
              { complete: false, id: 1, title: 'Widget 1' },
              { complete: false, id: 2, title: 'Widget 2' },
              { complete: true, id: 3, title: 'Widget 3' }
            ]
          ]);
        });

        it('must not call set store function if returns is false', () => {
          filtersWithServer.withServer(withServerFunc);
          withServerFunc.mockReturnValueOnce(false).mockName('withServerFunc');
          expect(storeSet.set).toHaveBeenCalledTimes(0);
          expect(withServerFunc).toHaveBeenCalledTimes(1);
          filtersWithServer.setFilter({ id: 'filter1', value: true, server: true });
          expect(withServerFunc).toHaveBeenCalledTimes(2);
          expect(storeSet.set).toHaveBeenCalledTimes(0);
        });

        describe('when set sort must not call sorting function', () => {
          let spySortFunction;
          let spySortingDataAccessor;

          beforeEach(() => {
            withServerFunc = jest.fn();
            // @ts-ignore
            filtersWithServer = new AkitaMatDataSource(widgetsQuery);
          });

          beforeEach(() => {
            filtersWithServer.sort = new MatSort();
            spySortFunction = jest.spyOn(akitaMatDataSource, 'sortFunction');
            spySortingDataAccessor = jest.spyOn(akitaMatDataSource, 'sortingDataAccessor');
          });

          afterEach(() => {
            spySortFunction.mockRestore();
            spySortingDataAccessor.mockRestore();
          });

          it('should not be called when sorting and return id to with server', () => {
            filtersWithServer.withServer(withServerFunc,  {withSort: true});
            filtersWithServer.sort.sort({
              id: 'id',
              start: 'desc',
              disableClear: false,
            });

            expect(spySortFunction).not.toHaveBeenCalled();
            expect(spySortingDataAccessor).not.toHaveBeenCalled();
            expect(filtersWithServer.akitaFiltersPlugIn.getNormalizedFilters(filtersWithServer.akitaFiltersPlugIn.withServerOptions)).toEqual({ sortBy: 'id', sortByOrder: 'desc' });
            expect(withServerFunc).toHaveBeenCalledTimes(2);
            expect(withServerFunc).toHaveBeenCalledWith({});
            expect(withServerFunc).toHaveBeenCalledWith({
              "sortBy": "id",
              "sortByOrder": "desc",
              });
          });

          it('should be called when server without sorting server', () => {
            withServerFunc.mockReturnValue(of([createWidget(1), createWidget(2), createWidget(3), createWidget(4)]));
            filtersWithServer.withServer(withServerFunc,  {withSort: false});
            filtersWithServer.connect().subscribe();
            filtersWithServer.sort.sort({
              id: 'id',
              start: 'desc',
              disableClear: false,
            });
            akitaMatDataSource.setFilter({ id: 'filter1', value: 'b' });



            expect(filtersWithServer.akitaFiltersPlugIn.getNormalizedFilters(filtersWithServer.akitaFiltersPlugIn.withServerOptions))
              .toMatchObject({});

            expect(withServerFunc).toHaveBeenCalledTimes(1);

          });

        });

      });

      describe('METHOD : getServerFilters()', () => {
        let filtersQuery;
        let withServerFunc;
        let filtersWithServer;



        beforeEach(() => {
          withServerFunc = jest.fn();
          // @ts-ignore
          filtersWithServer = new AkitaMatDataSource(widgetsQuery);
          filtersWithServer.selectSortBy = jest.fn();
        });

        it('when server is true, must return only server filters', () => {

          filtersWithServer.withServer(withServerFunc);
          filtersWithServer.setFilter({ id: 'filter1', value: true, server: true });
          filtersWithServer.setFilter({ id: 'filter2', value: 'aaaa', server: false });
          filtersWithServer.setFilter({ id: 'filter3', value: 'bbb', server: true });
          const serverFilters = filtersWithServer.akitaFiltersPlugIn.getServerFilters();

          expect(serverFilters.length).toEqual(2);
          expect(serverFilters[0]).toMatchObject({
            hide: false,
            id: 'filter1',
            name: 'Filter1: true',
            order: 10,
            server: true,
            value: true
          });
          expect(serverFilters[1]).toMatchObject({
            hide: false,
            id: 'filter3',
            name: 'Filter3: bbb',
            order: 10,
            server: true,
            value: 'bbb'
          });
        });

        it('when server is false, must return all filters', () => {

          filtersWithServer.setFilter({ id: 'filter1', value: true, server: true });
          filtersWithServer.setFilter({ id: 'filter2', value: 'aaaa', server: false });
          filtersWithServer.setFilter({ id: 'filter3', value: 'bbb', server: true });
          const serverFilters = filtersWithServer.akitaFiltersPlugIn.getServerFilters();

          expect(serverFilters.length).toEqual(3);
          expect(serverFilters[0]).toMatchObject({
            hide: false,
            id: 'filter1',
            name: 'Filter1: true',
            order: 10,
            server: true,
            value: true
          });
          expect(serverFilters[1]).toMatchObject({
            hide: false,
            id: 'filter2',
            name: 'Filter2: aaaa',
            order: 10,
            server: false,
            value: 'aaaa'
          });
          expect(serverFilters[2]).toMatchObject({
            hide: false,
            id: 'filter3',
            name: 'Filter3: bbb',
            order: 10,
            server: true,
            value: 'bbb'
          });
        });
      });

      describe('MATHOD : refresh()', () => {
        it('should call refresh from akitaFiltersPlugIn', () => {
          const refrehMock = jest.spyOn(akitaMatDataSource.akitaFiltersPlugIn, 'refresh');
          expect(akitaMatDataSource.refresh()).toEqual(1);
          expect(akitaMatDataSource.refresh()).toEqual(2);
          expect(akitaMatDataSource.refresh()).toEqual(3);
          expect(refrehMock).toHaveBeenCalledTimes(3);
        });
      });

    });

  });
});
