import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-products-header',
  templateUrl: './products-header.component.html',
})
export class ProductsHeaderComponent {

  @Output() columnsCountChange = new EventEmitter<number>();
  @Output() itemsCountChange = new EventEmitter<number>();
  @Output() SortChange = new EventEmitter<string>();

  sort = 'ascending';
  itemsShown = 10;

  onSortUpdate(newSort: string): void {
    this.sort = newSort;
    this.SortChange.emit(newSort);
  }

  onItemsShownUpdate(newItemsShown: number): void {
    this.itemsShown = newItemsShown;
    this.itemsCountChange.emit(newItemsShown);
  }

  onColumnsUpdate(newColumns: number): void {
    this.columnsCountChange.emit(newColumns);
  }
}
