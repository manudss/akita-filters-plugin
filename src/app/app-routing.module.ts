import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CartComponent} from './cart/cart.component';
import {HomeComponent} from './home/home.component';
import {ProductPageComponent} from './product-page/product-page.component';
import {ProductComponent} from './products/product/product.component';

const routes: Routes = [
  {
    component: HomeComponent,
    path: '',
    pathMatch: 'full'
  },
  {
    component: ProductPageComponent,
    path: 'product/:id'
  },
  {
    component: ProductComponent,
    path: 'list'
  },
  {
    component: CartComponent,
    path: 'cart'
  },
  {
    path: 'products',
    loadChildren: './products-filters/products-filters.module#ProductsFiltersModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
