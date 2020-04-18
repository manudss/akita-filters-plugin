import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WithServerDemoComponent} from './with-server-demo.component';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatChipsModule} from '@angular/material/chips';
import { HttpMethod, NG_ENTITY_SERVICE_CONFIG, NgEntityServiceGlobalConfig } from '@datorama/akita-ng-entity-service';


const routes: Routes = [
  {
    path: '',
    component: WithServerDemoComponent
  }
];

@NgModule({
  declarations: [WithServerDemoComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    MatSlideToggleModule,
    MatChipsModule
  ],
  providers: [{
    provide: NG_ENTITY_SERVICE_CONFIG,
    useValue: {
      baseUrl: 'https://jsonplaceholder.typicode.com'
    }
  }]
})
export class WithServerDemoModule {
}
