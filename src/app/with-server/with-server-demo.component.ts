import {AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {AkitaMatDataSource} from '../../../projects/akita-mat-datasource/src/lib/akita-mat-data-source';
import {ProductPlant, ProductPlantState, ProductsFiltersQuery, ProductsFiltersService} from '../products-filters/state';
import {CartService} from '../cart/state';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {PhotosState} from './with-server/state/photos-store.service';
import {PhotosQuery} from './with-server/state/users-query.service';
import {PhotosFiltersService} from './with-server/photos-filters.service';

@Component({
  selector: 'app-angular-material-demo',
  templateUrl: './with-server-demo.component.html',
  styleUrls: ['./with-server-demo.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WithServerDemoComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource: AkitaMatDataSource<PhotosState>;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'albumId', 'title', 'thumbnailUrl'];
  public usePaginator: boolean = true;


  ngOnInit(): void {
    this.dataSource = new AkitaMatDataSource<PhotosState>(this.photosQuery, this.photosService);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.limit = '30';
  }

  constructor(
    private photosService: PhotosFiltersService,
    private photosQuery: PhotosQuery) {}


  updatePaginator($event) {
    this.usePaginator = $event.checked;
    this.dataSource.paginator = (this.usePaginator) ? this.paginator : null;
  }

  get search() {
    return this.photosService.getFilterValue('title_like');
  }
  set search(searchQuery: string) {
    if (searchQuery === '') {
      this.photosService.removeFilter('title_like');
    } else {
      this.photosService.setFilter({id: 'title_like', value: searchQuery, name: searchQuery});
    }
  }

  get limit() {
    return this.photosService.getFilterValue('_limit');
  }
  set limit(searchQuery: string) {
    if (searchQuery === '') {
      this.photosService.removeFilter('_limit');
    } else {
      this.photosService.setFilter({id: '_limit', value: searchQuery, name: `Limit : ${searchQuery}`});
    }
  }

  get albumId() {
    return this.photosService.getFilterValue('albumId');
  }
  set albumId(searchQuery: string) {
    if (searchQuery === '') {
      this.photosService.removeFilter('albumId');
    } else {
      this.photosService.setFilter({id: 'albumId', server: true, value: searchQuery, name: `Album : ${searchQuery}`});
    }
  }

  get albumIdLocal() {
    return this.photosService.getFilterValue('albumIdLocal');
  }
  set albumIdLocal(searchQuery: string) {
    if (searchQuery === '') {
      this.photosService.removeFilter('albumIdLocal');
    } else {
      this.photosService.setFilter({id: 'albumIdLocal', server: false, value: searchQuery, name: `[local] Album  : ${searchQuery}`, predicate: entity => entity.albumId === parseInt(searchQuery, 10)});
    }
  }


}
