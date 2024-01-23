import { Component, OnInit } from '@angular/core';
import { Cart } from './models/cart.model';
import { CartService } from './services/cart.service';
import { SpeechService } from './services/speech.service';

@Component({
  selector: 'app-root',
  template: `
  <app-header [cart]="cart"></app-header>
  <app-assistant *ngIf="speech.speechSupported"></app-assistant>
  <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent implements OnInit {
  cart: Cart = { items: [] };

  constructor(private cartService: CartService, public speech: SpeechService) { }

  ngOnInit() {
    this.cartService.cart.subscribe((_cart) => {
      this.cart = _cart;
    });
  }
}
