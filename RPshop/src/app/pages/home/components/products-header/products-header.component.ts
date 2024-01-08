import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-products-header',
  templateUrl: './products-header.component.html',
})
export class ProductsHeaderComponent {

  @Output() columnsCountChange = new EventEmitter<number>();
  sort = 'ascending';
  itemsShown = 12;

  onSortUpdate(newSort: string): void {
    this.sort = newSort;
  }

  onItemsShownUpdate(newItemsShown: number): void {
    this.itemsShown = newItemsShown;
  }

  onColumnsUpdate(newColumns: number): void {
    this.columnsCountChange.emit(newColumns);
  }
}
