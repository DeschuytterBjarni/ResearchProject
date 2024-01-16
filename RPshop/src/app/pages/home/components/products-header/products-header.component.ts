import { Component, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { SpeechService } from '../../../../services/speech.service';
import { HomeComponent } from '../../home.component';

@Component({
  selector: 'app-products-header',
  templateUrl: './products-header.component.html',
})
export class ProductsHeaderComponent {

  @Output() columnsCountChange = new EventEmitter<number>();
  @Output() itemsCountChange = new EventEmitter<number>();
  @Output() SortChange = new EventEmitter<string>();

  listenSubscription: Subscription | undefined;

  sort = 'ascending';
  itemsShown = 10;
  currentCols: number = 3;

  constructor(public speech: SpeechService, private home: HomeComponent) { }

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

  private _listen() {
    this.listenSubscription = this.speech.string$.subscribe(text => this._setString(text));
  }

  private _setString(text: string) {
    // match the text to a command
    if (text.includes('ascending')) {
      console.log('ascending');
      this.onSortUpdate('ascending');
    }
    if (text.includes('descending')) {
      console.log('descending');
      this.onSortUpdate('descending');
    }
    if (text.includes('10')) {
      console.log('items shown 10');
      this.onItemsShownUpdate(10);
    }
    if (text.includes('15')) {
      console.log('items');
      console.log('items shown 15');
      this.onItemsShownUpdate(15);
    }
    if (text.includes('20')) {
      console.log('items shown 20');
      this.onItemsShownUpdate(20);
    }
    if (text.includes('change layout')) {
      console.log('change to next layout');
      console.log('current cols:', this.currentCols);
      this._setColumns(this.currentCols);
    }
  }

  private _setColumns(cols: number) {
    if (cols) {
    }
    // match the cols to a command
    if (cols === 1) {
      this.onColumnsUpdate(3);
      this.currentCols = 3;
      return;
    }
    if (cols === 3) {
      this.onColumnsUpdate(4);
      this.currentCols = 4;
      return;
    }
    if (cols === 4) {
      this.onColumnsUpdate(1);
      this.currentCols = 1;
      return;
    }
  }

  ngOnInit() {
    this.speech.init();
    this._listen();
  }
  ngOnDestroy() {
    this.listenSubscription?.unsubscribe();
  }

}
