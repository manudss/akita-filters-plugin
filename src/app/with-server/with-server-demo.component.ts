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
  displayedColumns = ['id', 'title', 'thumbnailUrl'];
  public usePaginator: boolean = true;


  ngOnInit(): void {
    this.dataSource = new AkitaMatDataSource<PhotosState>(this.photosQuery, this.photosService);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.photosService.load();
  }

  constructor(
    private photosService: PhotosFiltersService,
    private photosQuery: PhotosQuery) {}


  updatePaginator($event) {
    this.usePaginator = $event.checked;
    this.dataSource.paginator = (this.usePaginator) ? this.paginator : null;
  }


}
