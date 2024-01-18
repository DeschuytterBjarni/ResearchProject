import { Component } from '@angular/core';
import { Cart, CartItem } from '../../models/cart.model';
import { CartService } from '../../services/cart.service';
import { HttpClient } from '@angular/common/http';
import { loadStripe } from '@stripe/stripe-js';
import { Subscription } from 'rxjs';
import { SpeechService } from '../../services/speech.service';
import { LevenshteinDistanceService } from '../../services/levenshtein-distance.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html'
})
export class CartComponent {
  cart: Cart = {
    items: [
      {
        product: 'https://via.placeholder.com/150',
        name: 'Test Product',
        price: 9.99,
        quantity: 1,
        id: 1
      },
      {
        product: 'https://via.placeholder.com/150',
        name: 'Test Product 2',
        price: 19.99,
        quantity: 2,
        id: 2
      }
    ]
  };

  dataSource: Array<CartItem> = []
  displayedColumns: Array<string> = ['product', 'name', 'price', 'quantity', 'total', 'action'];

  listenSubscription: Subscription | undefined;

  constructor(private _cartService: CartService, private http: HttpClient, public speech: SpeechService, public lvnDis: LevenshteinDistanceService) { }

  ngOnInit(): void {
    this._listen();
    this._cartService.cart.subscribe((_cart) => {
      this.cart = _cart;
      this.dataSource = this.cart.items;
    });
  }

  getTotalCost(items: Array<CartItem>): number {
    return this._cartService.getTotalCost(items);
  }

  onClearCart(): void {
    this._cartService.clearCart();
  }

  onRemoveFromCart(item: CartItem): void {
    this._cartService.removeFromCart(item);
  }

  onAddQuantity(item: CartItem): void {
    this._cartService.addToCart(item);
  }

  onReduceQuantity(item: CartItem): void {
    this._cartService.reduceQuantity(item);
  }

  private _listen() {
    this.listenSubscription = this.speech.cart$.subscribe(text => this._setString(text));
  }

  private _setString(text: string) {
    let shortestDistance = 100;
    let bestMatch: string | undefined;
    let bestMatchProduct: CartItem | undefined;

    if (text.includes('clear cart')) {
      this.onClearCart();
    }

    if (text.includes('quantity up: ')) {
      let product = text.replace('quantity up: ', '');
      for (const item of this.cart.items) {
        const check = this.lvnDis.LevenshteinAfstand(product, item.name.slice(0, 25));
        if (check < shortestDistance) {
          shortestDistance = check;
          bestMatch = item.name;
          bestMatchProduct = item;
        }
      }
      console.log('bestMatch:', bestMatch);
      if (bestMatchProduct) {
        this.onAddQuantity(bestMatchProduct);
      }
    }

    if (text.includes('quantity down: ')) {
      let product = text.replace('quantity down: ', '');
      for (const item of this.cart.items) {
        const check = this.lvnDis.LevenshteinAfstand(product, item.name.slice(0, 25));
        if (check < shortestDistance) {
          shortestDistance = check;
          bestMatch = item.name;
          bestMatchProduct = item;
        }
      }
      console.log('bestMatch:', bestMatch);
      if (bestMatchProduct) {
        this.onReduceQuantity(bestMatchProduct);
      }
    }

    if (text.includes('remove: ')) {
      let product = text.replace('remove: ', '');
      for (const item of this.cart.items) {
        const check = this.lvnDis.LevenshteinAfstand(product, item.name.slice(0, 25));
        if (check < shortestDistance) {
          shortestDistance = check;
          bestMatch = item.name;
          bestMatchProduct = item;
        }
      }
      console.log('bestMatch:', bestMatch);
      if (bestMatchProduct) {
        this.onRemoveFromCart(bestMatchProduct);
      }
    }
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

  ngOnDestroy() {
    this.listenSubscription?.unsubscribe();
  }
}