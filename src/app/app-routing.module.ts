import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CartComponent} from './cart/cart.component';
import {HomeComponent} from './home/home.component';

const routes: Routes = [
  {
    component: HomeComponent,
    path: '',
    pathMatch: 'full'
  },
  {
    component: CartComponent,
    path: 'cart'
  },
  {
    path: 'products',
    loadChildren: () => import('./products-filters/products-filters.module').then(m => m.ProductsFiltersModule)
  },
  {
    path: 'angular-material-demo',
    loadChildren: () => import('./angular-material-demo/angular-material-demo.module').then(m => m.AngularMaterialDemoModule)
  },
  {
    path: 'photos',
    loadChildren: () => import('./with-server/with-server-demo.module').then(m => m.WithServerDemoModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
