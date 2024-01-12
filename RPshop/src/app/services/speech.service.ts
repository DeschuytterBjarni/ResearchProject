import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';

// TypeScript declaration for annyang
declare const annyang: any;

@Injectable()
export class SpeechService {
  words$ = new Subject<{ [key: string]: string }>();
  string$ = new Subject<string>();
  errors$ = new Subject<{ [key: string]: any }>();
  listening = false;

  constructor(private zone: NgZone) { }

  get speechSupported(): boolean {
    return !!annyang;
  }

  init() {
    const commands = {
      'add *item': (res: any) => {
        this.zone.run(() => {
          res = "to cart: " + res;
          console.log(res);
          this.string$.next(res);
        });
      },
      'sort by :sort': (res: any) => {
        this.zone.run(() => {
          this.string$.next(res);
        });
      },
      'swords by :sort': (res: any) => {
        this.zone.run(() => {
          this.string$.next(res);
        });
      },
      'show :num items': (res: any) => {
        this.zone.run(() => {
          this.string$.next(res);
        });
      },
      'change (to next) layout': () => {
        this.zone.run(() => {
          this.string$.next('change layout');
        });
      },
      'stop listening': () => {
        this.zone.run(() => {
          this.string$.next('stop listening');
        });
      }

    };
    annyang.addCommands(commands);

    // Log anything the user says and what speech recognition thinks it might be
    // annyang.addCallback('result', (userSaid: any) => {
    //   console.log('User may have said:', userSaid);
    // });
    annyang.addCallback('errorNetwork', (err: any) => {
      this._handleError('network', 'A network error occurred.', err);
    });
    annyang.addCallback('errorPermissionBlocked', (err: any) => {
      this._handleError('blocked', 'Browser blocked microphone permissions.', err);
    });
    annyang.addCallback('errorPermissionDenied', (err: any) => {
      this._handleError('denied', 'User denied microphone permissions.', err);
    });
    annyang.addCallback('resultNoMatch', (userSaid: any) => {
      this._handleError(
        'no match',
        'Spoken command not recognized.',
        { results: userSaid });
    });
  }

  private _handleError(error: string, msg: string, errObj: { results: any; }) {
    this.zone.run(() => {
      this.errors$.next({
        error: error,
        message: msg,
        obj: errObj
      });
    });
  }

  startListening() {
    annyang.start();
    this.listening = true;
  }

  abort() {
    annyang.abort();
    this.listening = false;
  }

}