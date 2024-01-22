import { Component, Input } from '@angular/core';
import { Cart, CartItem } from '../../models/cart.model';
import { CartService } from '../../services/cart.service';
import { loadStripe } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { SpeechService } from '../../services/speech.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  private _cart: Cart = { items: [] };
  itemsQuantity = 0;
  listenSubscription: Subscription | undefined;

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

  constructor(private _cartService: CartService, private http: HttpClient, public speech: SpeechService, private router: Router) { }

  ngOnInit(): void {
    this._listen();
  }

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

  private _setString(nav: string) {
    switch (nav) {
      case 'home':
        this.router.navigate(['/']);
        break;
      case 'cart':
        this.router.navigate(['/cart']);
        break;
      case 'carts':
        this.router.navigate(['/cart']);
        break;
      case 'card':
        this.router.navigate(['/cart']);
        break;
      case 'cards':
        this.router.navigate(['/cart']);
        break;
      case 'checkout':
        this.onCheckout();
        break;
      default:
        console.log('Navigation not found, please try again');
        break;
    }
  }

  private _listen() {
    this.listenSubscription = this.speech.navigation$.subscribe(nav => this._setString(nav));
  }

  ngOnDestroy() {
    this.listenSubscription?.unsubscribe();
  }
}
