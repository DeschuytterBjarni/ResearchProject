import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

const STORE_BASE_URL = 'https://fakestoreapi.com';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(private httpClient: HttpClient) { }

  getAllProducts(limit = '10', sort = 'asc', category?: string): Observable<Array<Product>> {
    try {
      return this.httpClient.get<Array<Product>>(`${STORE_BASE_URL}/products${category ? '/category/' + category : ''}?limit=${limit}&sort=${sort}`);
    } catch (error) {
      console.error(error);
      return new Observable<Array<Product>>();
    }
  }

  getAllCategories(): Observable<Array<string>> {
    try {
      return this.httpClient.get<Array<string>>(`${STORE_BASE_URL}/products/categories`);
    } catch (error) {
      console.error(error);
      return new Observable<Array<string>>();
    }
  }
}
