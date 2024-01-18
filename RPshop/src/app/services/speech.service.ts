import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';

// TypeScript declaration for annyang
declare const annyang: any | undefined;

@Injectable()
export class SpeechService {
  string$ = new Subject<string>();
  item$ = new Subject<string>();
  category$ = new Subject<string>();
  navigation$ = new Subject<string>();
  errors$ = new Subject<{ [key: string]: any }>();
  listening = false;

  constructor(private zone: NgZone) { }

  get speechSupported(): boolean {
    return !!annyang;
  }

  init() {
    const controlCommands = {
      'add *item': (res: any) => {
        this.zone.run(() => {
          console.log(res);
          this.item$.next(res);
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
      'show category *cat': (res: any) => {
        this.zone.run(() => {
          this.category$.next(res);
        });
      },
      'stop listening': () => {
        this.zone.run(() => {
          this.string$.next('stop listening');
        });
      },
    }
    const navigationCommands = {
      'go to (shopping) :nav': (res: any) => {
        this.zone.run(() => {
          res = "go to: " + res;
          this.navigation$.next(res);
        });
      },
    }
    const cartCommands = {

      'clear (shopping) cart': () => {
        this.zone.run(() => {
          this.string$.next('clear cart');
        });
      },
      'remove *item': (res: any) => {
        this.zone.run(() => {
          res = "remove: " + res;
          this.string$.next(res);
        });
      },
      'quantity up *item': (res: any) => {
        this.zone.run(() => {
          res = "quantity up: " + res;
          this.string$.next(res);
        });
      },
      'quantity down *item': (res: any) => {
        this.zone.run(() => {
          res = "quantity down: " + res;
          this.string$.next(res);
        });
      },
    };
    annyang.addCommands(controlCommands);
    annyang.addCommands(navigationCommands);
    annyang.addCommands(cartCommands);

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