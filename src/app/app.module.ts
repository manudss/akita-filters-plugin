import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import {AppRoutingModule} from './app-routing.module';
import {CartComponent} from './cart/cart.component';
import {NavComponent} from './nav/nav.component';
import {environment} from '../environments/environment';
import {AkitaNgDevtools} from '@datorama/akita-ngdevtools';
import {MarkdownModule} from 'ngx-markdown';
import {CommonModule} from '@angular/common';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {CartModule} from "./cart/cart.module";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    CartModule,
    environment.production ? [] : AkitaNgDevtools.forRoot(),
    MarkdownModule.forRoot({ loader: HttpClient })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
