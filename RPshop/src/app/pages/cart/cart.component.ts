import { Component } from '@angular/core';
import { Cart, CartItem } from '../../models/cart.model';
import { CartService } from '../../services/cart.service';

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

  constructor(private _cartService: CartService) { }

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
}