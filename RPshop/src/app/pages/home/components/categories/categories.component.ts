import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
})
export class CategoriesComponent {
  @Output() showCategory = new EventEmitter<string>();

  categories = ['shoes', 'shirts', 'jewelry'];

  onShowCategory(category: string): void {
    this.showCategory.emit(category);
  }
}
