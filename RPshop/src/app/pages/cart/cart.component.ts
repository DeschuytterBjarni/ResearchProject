import { Component } from '@angular/core';
import { Cart, CartItem } from '../../models/cart.model';
import { CartService } from '../../services/cart.service';
import { HttpClient } from '@angular/common/http';
import { loadStripe } from '@stripe/stripe-js';

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

  constructor(private _cartService: CartService, private http: HttpClient) { }

  ngOnInit(): void {
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