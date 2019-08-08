import {AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { AngularMaterialDemoDataSource } from './angular-material-demo-datasource';
import {AkitaMatDataSource} from '../../../projects/akita-filters-plugin/src/lib/bonus/akita-mat-data-source';
import {ProductPlant, ProductPlantState, ProductsFiltersQuery, ProductsFiltersService} from '../products-filters/state';
import {CartService} from '../cart/state';

@Component({
  selector: 'app-angular-material-demo',
  templateUrl: './angular-material-demo.component.html',
  styleUrls: ['./angular-material-demo.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AngularMaterialDemoComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource: AkitaMatDataSource<ProductPlant, ProductPlantState>;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'title'];


  ngOnInit(): void {
    this.dataSource = new AkitaMatDataSource<ProductPlant, ProductPlantState>(this.productsQuery);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.productsService.get().subscribe(() => {
      console.log('loaded data : ', this.dataSource, this.productsQuery.getCount());
    });

    console.log('datasource : ', this.dataSource, this.productsQuery.getCount());
  }

  constructor(private productsService: ProductsFiltersService, private cartService: CartService, private productsQuery: ProductsFiltersQuery) {}
}
