import {AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {AkitaMatDataSource} from '../../../projects/akita-mat-datasource/src/lib/akita-mat-data-source';
import {ProductPlant, ProductPlantState, ProductsFiltersQuery, ProductsFiltersService} from '../products-filters/state';
import {CartService} from '../cart/state';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-angular-material-demo',
  templateUrl: './angular-material-demo.component.html',
  styleUrls: ['./angular-material-demo.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AngularMaterialDemoComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource: AkitaMatDataSource<ProductPlantState>;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'title'];
  public usePaginator: boolean = true;


  ngOnInit(): void {
    this.dataSource = new AkitaMatDataSource<ProductPlantState>(this.productsQuery, this.productsService.filtersProduct);
    this.productsService.get().subscribe();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  constructor(
    private productsService: ProductsFiltersService,
    private cartService: CartService,
    private productsQuery: ProductsFiltersQuery) {}


  updatePaginator($event) {
    this.usePaginator = $event.checked;
    this.dataSource.paginator = (this.usePaginator)? this.paginator : null;
  }


}
