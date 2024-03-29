import { Component, OnDestroy, OnInit, NgZone } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { Subscription } from 'rxjs';
import { StoreService } from '../../services/store.service';
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
  itemSubscription: Subscription | undefined;
  categorySubscription: Subscription | undefined;

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

  private _setItemString(product: string) {
    // check LevenshteinAfstand against all products
    if (this.products) {
      let shortestDistance = 100;
      let bestMatch: string | undefined;
      let bestMatchProduct: Product | undefined;

      for (const p of this.products) {
        const check = this.lvnDis.LevenshteinAfstand(product, p.title.slice(0, 25));
        if (shortestDistance > check) {
          shortestDistance = check;
          bestMatch = p.title;
          bestMatchProduct = p;
        }
        console.log('levenshteinDis: ', p.title, " ", check);
      }
      console.log('bestMatch: ', bestMatch, shortestDistance);
      if (bestMatchProduct) {
        this.onAddToCart(bestMatchProduct);
      }
    }
  }

  private _setCategoryString(category: string) {
    this.storeService.getAllCategories().subscribe(allCategories => {
      if (allCategories.includes(category)) {
        this.onShowCategory(category);
      } else {
        // check LevenshteinAfstand against all categories
        let shortestDistance = 100;
        let bestMatch: string | undefined;

        for (const c of allCategories) {
          const check = this.lvnDis.LevenshteinAfstand(category, c);
          if (shortestDistance > check) {
            shortestDistance = check;
            bestMatch = c;
          }
          if (shortestDistance < 3 && bestMatch) {
            this.onShowCategory(bestMatch);
          }
          console.log('levenshteinDis: ', c, " ", check);
        }
        console.log('category not found', category);
      }
    });
  }

  private _listen() {
    this.itemSubscription = this.speech.item$.subscribe(text => this._setItemString(text));
    this.categorySubscription = this.speech.category$.subscribe(text => this._setCategoryString(text));
  }

  ngOnDestroy(): void {
    this.productsSubscription?.unsubscribe();
    this.itemSubscription?.unsubscribe();
    this.categorySubscription?.unsubscribe();
  }
}
