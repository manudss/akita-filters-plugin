import { Component } from '@angular/core';
import { CartQuery } from '../cart/state';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { resetStores } from '@datorama/akita';

@Component({
  selector: 'app-nav',
  template: `
    <nav>
      <div class="nav-wrapper cyan lighten-2">
        <a class="brand-logo" routerLink="/">Akita Filter Exemple</a>
        <ul id="nav-mobile" class="right hide-on-med-and-down">
          <li><a (click)="resetStores()">Reset Stores</a></li>
          <li *ngFor="let item of navItems">
            <a routerLinkActive="blue-text text-lighten-2" [routerLink]="item.toLowerCase()">{{item}}</a>
          </li>
          <li><a routerLinkActive="blue-text text-lighten-2" routerLink="cart">Cart <span class="new badge">{{count$ | async}}</span></a></li>
        </ul>
      </div>
    </nav>
  `
})
export class NavComponent {
  navItems = ['Products', 'list'];
  count$: Observable<number>;

  constructor(private cartQuery: CartQuery, private router: Router) {
    this.count$ = this.cartQuery.selectCount();
  }


  resetStores() {
    resetStores();
  }
}
