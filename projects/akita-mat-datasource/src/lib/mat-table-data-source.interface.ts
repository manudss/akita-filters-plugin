import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {BehaviorSubject} from 'rxjs';

export interface MatTableDataSourceInterface<T> {
    data: T[];
    filter: string;
    paginator: MatPaginator;
    sort: MatSort;
    filterPredicate: ((data: T, filter: string) => boolean);
    filteredData: T[];
    sortData: ((data: T[], sort: MatSort) => T[]);
    sortingDataAccessor: ((data: T, sortHeaderId: string) => string | number);
}
