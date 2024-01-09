import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../../../models/product.model';

@Component({
  selector: 'app-product-box',
  templateUrl: './product-box.component.html',
})
export class ProductBoxComponent {
  @Input() fullWidthMode: boolean = false;
  @Output() addToCart = new EventEmitter();

  product: Product | undefined = {
    id: 1,
    title: 'Product name',
    price: 100,
    category: 'Product category',
    description: 'Product description',
    image: 'https://via.placeholder.com/150',
  };


  onAddToCart(): void {
    this.addToCart.emit(this.product);
  }
}
