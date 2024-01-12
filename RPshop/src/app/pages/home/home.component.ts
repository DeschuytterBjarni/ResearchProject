import { Component, OnDestroy, OnInit, NgZone } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { Subscription } from 'rxjs';
import { StoreService } from '../../services/store.service';
import { get } from 'http';
import { SpeechService } from '../../services/speech.service';
import { LevenshteinDistanceService } from '../../services/levenshtein-distance.service';

const ROWS_HEIGHT: { [id: number]: number } = { 1: 400, 3: 355, 4: 350 }

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {

  cols = 3;
  rowHeight = ROWS_HEIGHT[this.cols];
  category: string | undefined
  products: Array<Product> | undefined;
  sort = 'asc';
  count = '10';
  productsSubscription: Subscription | undefined;
  listenSubscription: Subscription | undefined;

  constructor(private cartService: CartService, private storeService: StoreService, public speech: SpeechService, public lvnDis: LevenshteinDistanceService) { }

  ngOnInit(): void {
    this.getProducts();
    this._listen();
  }

  getProducts(): void {
    this.productsSubscription = this.storeService.getAllProducts(this.count, this.sort, this.category).subscribe((_products) => {
      this.products = _products;
    });
  }

  onColumnsCountChange(newCols: number): void {
    this.cols = newCols;
    this.rowHeight = ROWS_HEIGHT[this.cols];
  }

  onShowCategory(newCategory: string): void {
    this.category = newCategory;
    this.getProducts();
  }

  onAddToCart(product: Product): void {
    this.cartService.addToCart({
      product: product.image,
      name: product.title,
      price: product.price,
      quantity: 1,
      id: product.id,
    });
  }

  onitemsCountChange(newCount: number): void {
    this.count = newCount.toString();
    this.getProducts();
  }

  onSortChange(newSort: string): void {
    if (newSort === "ascending") {
      this.sort = 'asc';
    } else if (newSort === "descending") {
      this.sort = 'desc';
    }
    this.getProducts();
  }

  private _setString(text: string) {
    if (text) {
      console.log('Speech Recognition home:', text);
    }
    if (text.includes('to cart:')) {
      let product = text.replace('to cart:', '');
      // check LevenshteinAfstand against all products
      if (this.products) {
        let shortestDistance = 100;
        let bestMatch: string | undefined;
        let bestMatchProduct: Product | undefined;

        for (const p of this.products) {
          if (shortestDistance > this.lvnDis.LevenshteinAfstand(product, p.title) - p.title.length) {
            shortestDistance = this.lvnDis.LevenshteinAfstand(product, p.title) - p.title.length;
            bestMatch = p.title;
            bestMatchProduct = p;
          }
          console.log('levenshteinDis: ', p.title, " ", this.lvnDis.LevenshteinAfstand(product, p.title) - p.title.length);
        }
        console.log('bestMatch: ', bestMatch, shortestDistance);
        if (bestMatchProduct) {
          this.onAddToCart(bestMatchProduct);
        }
      }
    }
  }

  private _listen() {
    this.listenSubscription = this.speech.string$.subscribe(text => this._setString(text));
  }

  ngOnDestroy(): void {
    if (this.productsSubscription) {
      this.productsSubscription.unsubscribe();
    }
    this.listenSubscription?.unsubscribe();
  }
}
