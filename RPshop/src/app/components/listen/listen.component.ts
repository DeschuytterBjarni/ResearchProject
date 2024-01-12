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
  nouns: string[] | undefined;
  verbs: string[] | undefined;
  adjs: string[] | undefined;
  subs: Subscription | undefined;
  testListen: Subscription | undefined;
  nounSub: Subscription | undefined;
  verbSub: Subscription | undefined;
  adjSub: Subscription | undefined;
  errorsSub: Subscription | undefined;
  errorMsg: any;
  subscription: any;

  constructor(public speech: SpeechService) { }

  ngOnInit() {
    this.speech.init();
    this._listen();
    // this._listenNouns();
    // this._listenVerbs();
    // this._listenAdj();
    this._listenErrors();
  }

  get btnLabel(): string {
    return this.speech.listening ? 'Listening...' : 'Listen';
  }

  // private _listenNouns() {
  // this.testListen = this.speech.words$
  // console.log(this.testListen);
  // .filter((obj: { type: string; }) => obj.type === 'noun')
  // .map((nounObj: { word: string; }) => nounObj.word)
  // .subscribe(
  //   (noun: string) => {
  //     this._setError();
  //     console.log('noun:', noun);
  //   }
  // );
  // }

  // private _listenVerbs() {
  //   this.verbSub = this.speech.words$
  //     .filter((obj: { type: string; }) => obj.type === 'verb')
  //     .map((verbObj: { word: any; }) => verbObj.word)
  //     .subscribe(
  //       (verb: any) => {
  //         this._setError();
  //         console.log('verb:', verb);
  //       }
  //     );
  // }

  // private _listenAdj() {
  //   this.adjSub = this.speech.words$
  //     .filter((obj: { type: string; }) => obj.type === 'adj')
  //     .map((adjObj: { word: any; }) => adjObj.word)
  //     .subscribe(
  //       (adj: any) => {
  //         this._setError();
  //         console.log('adjective:', adj);
  //       }
  //     );
  // }

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
    this.testListen = this.speech.string$.subscribe(text => this._setString(text));
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
    if (this.nounSub) {
      this.nounSub.unsubscribe();
    }
    if (this.verbSub) {
      this.verbSub.unsubscribe();
    }
    if (this.adjSub) {
      this.adjSub.unsubscribe();
    }
    if (this.errorsSub) {
      this.errorsSub.unsubscribe();
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}