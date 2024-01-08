import { Component } from '@angular/core';
import { Cart, CartItem } from '../../models/cart.model';

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

  ngOnInit(): void {
    this.dataSource = this.cart.items;
  }

  getTotalCost(items: Array<CartItem>): number {
    return items.map((item) => item.price * item.quantity).reduce((prev, current) => prev + current, 0);
  }
}
