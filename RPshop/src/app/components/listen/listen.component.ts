// src/app/listen/listen.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SpeechService } from '../../services/speech.service';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-listen',
  templateUrl: './listen.component.html'
})
export class ListenComponent implements OnInit, OnDestroy {
  listen: Subscription | undefined;
  errorsSub: Subscription | undefined;
  errorMsg: any;
  subscription: any;

  constructor(public speech: SpeechService) { }

  ngOnInit() {
    this.speech.init();
    this._listen();
    this._listenErrors();
  }

  get btnLabel(): string {
    return this.speech.listening ? 'Listening...' : 'Listen';
  }

  private _listenErrors() {
    this.errorsSub = this.speech.errors$
      .subscribe(err => this._setError(err));
  }

  private _setError(err?: any) {
    if (err) {
      console.log('Speech Recognition:', err);
      this.errorMsg = err.message;
    } else {
      this.errorMsg = null;
    }
  }

  private _listen() {
    this.listen = this.speech.string$.subscribe(text => this._setString(text));
  }

  private _setString(text: string) {
    if (text) {
      console.log('Speech Recognition:', text);
    }
    if (text.includes('stop listening')) {
      this.speech.abort();
    }
  }

  ngOnDestroy() {
    this.errorsSub?.unsubscribe();
    this.subscription?.unsubscribe();
  }
}