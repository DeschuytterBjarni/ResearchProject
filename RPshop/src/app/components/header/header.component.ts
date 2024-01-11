import { Component, Input } from '@angular/core';
import { Cart, CartItem } from '../../models/cart.model';
import { CartService } from '../../services/cart.service';
import { loadStripe } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  private _cart: Cart = { items: [] };
  itemsQuantity = 0;

  @Input()
  get cart(): Cart {
    return this._cart;
  }

  set cart(cart: Cart) {
    this._cart = cart;
    this.itemsQuantity = cart.items
      .map((item) => item.quantity)
      .reduce((prev, curent) => prev + curent, 0);
  }

  constructor(private _cartService: CartService, private http: HttpClient) { }


  getTotalCost(items: Array<CartItem>): number {
    return this._cartService.getTotalCost(items);
  }

  onCheckout(): void {
    this.http.post('http://localhost:4242/checkout', {
      items: this.cart.items
    }).subscribe(async (res: any) => {
      let stripe = await loadStripe('pk_test_51OXMyXBAGXxtjoebM9M8wpjdIxljqKQajqk4zczFV1DgcTLFJ2Lb1okLPYqaxQAawKFlGsXyiaDHWrJ8pC3vjD4X00pn8qAbYm');
      stripe?.redirectToCheckout({
        sessionId: res.id
      });
    });
  }
}
