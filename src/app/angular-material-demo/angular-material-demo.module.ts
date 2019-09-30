import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AngularMaterialDemoComponent} from './angular-material-demo.component';
// import {MatFormFieldModule, MatIconModule, MatInputModule, MatPaginatorModule, MatSortModule, MatTableModule} from '@angular/material';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";

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
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        FormsModule,
        MatSlideToggleModule
    ]
})
export class AngularMaterialDemoModule { }
