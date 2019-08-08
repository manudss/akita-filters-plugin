import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AngularMaterialDemoComponent} from './angular-material-demo.component';
import {MatPaginatorModule, MatSortModule, MatTableModule} from '@angular/material';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: AngularMaterialDemoComponent
  }
];

@NgModule({
  declarations: [AngularMaterialDemoComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ]
})
export class AngularMaterialDemoModule { }
