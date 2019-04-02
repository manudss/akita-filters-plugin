import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import {AppRoutingModule} from './app-routing.module';
import {CartComponent} from './cart/cart.component';
import {NavComponent} from './nav/nav.component';
import {environment} from '../environments/environment';
import {AkitaNgDevtools} from "@datorama/akita-ngdevtools";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CartComponent,
    NavComponent
  ],
  imports: [
    environment.production ? [] : AkitaNgDevtools.forRoot(),
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
