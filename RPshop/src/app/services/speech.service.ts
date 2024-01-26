import { Location } from '@angular/common';
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
  cart$ = new Subject<string>();
  errors$ = new Subject<{ [key: string]: any }>();
  system$ = new Subject<string>();
  page$ = new Subject<string>();
  listening = false;

  constructor(private zone: NgZone, private location: Location) { }

  get speechSupported(): boolean {
    return typeof annyang !== 'undefined';
  }

  init() {
    annyang.setLanguage('en-US');
    const dutchCommands = {
      'Ga naar :nav': (res: any) => {
        this.zone.run(() => {
          this.navigation$.next(res);
          this.system$.next("Navigating to " + res + " page.");
        });
      },
      'Voeg *item toe (aan winkelmand)': (res: any) => {
        this.zone.run(() => {
          console.log(res);
          this.item$.next(res);
          this.system$.next("Adding " + res + " to cart.");
        });
      },
      'Scroll naar beneden': () => {
        this.zone.run(() => {
          this.string$.next('scroll down');
          this.system$.next("Scrolling down.");
        });
      },
      'Scroll naar boven': () => {
        this.zone.run(() => {
          this.string$.next('scroll up');
          this.system$.next("Scrolling up.");
        });
      },
      'Sorteer aflopend': (res: any) => {
        this.zone.run(() => {
          this.string$.next("descending");
          this.system$.next("Sorting by " + res + ".");
        });
      },
      'Sorteer oplopend': (res: any) => {
        this.zone.run(() => {
          this.string$.next("ascending");
          this.system$.next("Sorting by " + res + ".");
        });
      },
      // probleem met 10 items (wordt 'teen items')
      'Toon :num items': (res: any) => {
        this.zone.run(() => {
          this.string$.next(res);
          this.system$.next("Showing " + res + " items.");
        });
      },
      'Verander (van) layout': () => {
        this.zone.run(() => {
          this.string$.next('change layout');
          this.system$.next("Changing layout.");
        });
      },
      // werkt niet altijd. categoriën worden in het engels opgehaald
      'Toon categorie *cat': (res: any) => {
        this.zone.run(() => {
          this.category$.next(res);
          this.system$.next("Showing category " + res + ".");
        });
      },
      'Toon assistent': () => {
        this.zone.run(() => {
          this.string$.next('show assistant');
          this.system$.next("Showing assistant.");
        });
      },
      'Verberg assistent': () => {
        this.zone.run(() => {
          this.string$.next('hide assistant');
          this.system$.next("Hiding assistant.");
        });
      },
      'Verbergassistent': () => {
        this.zone.run(() => {
          this.string$.next('hide assistant');
          this.system$.next("Hiding assistant.");
        });
      },
      'Stop met luisteren': () => {
        this.zone.run(() => {
          this.string$.next('stop listening');
          this.system$.next("Stopped listening.");
        });
      },
    }
    const controlCommands = {
      'scroll down': () => {
        this.zone.run(() => {
          this.string$.next('scroll down');
          this.system$.next("Scrolling down.");
        });
      },
      'scroll up': () => {
        this.zone.run(() => {
          this.string$.next('scroll up');
          this.system$.next("Scrolling up.");
        });
      },
      'sort by :sort': (res: any) => {
        this.zone.run(() => {
          this.string$.next(res);
          this.system$.next("Sorting by " + res + ".");
        });
      },
      'swords by :sort': (res: any) => {
        this.zone.run(() => {
          this.string$.next(res);
          this.system$.next("Sorting by " + res + ".");
        });
      },
      'show :num items': (res: any) => {
        this.zone.run(() => {
          this.string$.next(res);
          this.system$.next("Showing " + res + " items.");
        });
      },
      'change (to next) layout': () => {
        this.zone.run(() => {
          this.string$.next('change layout');
          this.system$.next("Changing layout.");
        });
      },
      'show category *cat': (res: any) => {
        this.zone.run(() => {
          this.category$.next(res);
          this.system$.next("Showing category " + res + ".");
        });
      },
      'show assistant': () => {
        this.zone.run(() => {
          this.string$.next('show assistant');
          this.system$.next("Showing assistant.");
        });
      },
      'show assistance': () => {
        this.zone.run(() => {
          this.string$.next('show assistant');
          this.system$.next("Showing assistant.");
        });
      },
      'hide assistant': () => {
        this.zone.run(() => {
          this.string$.next('hide assistant');
          this.system$.next("Hiding assistant.");
        });
      },
      'hide assistance': () => {
        this.zone.run(() => {
          this.string$.next('hide assistant');
          this.system$.next("Hiding assistant.");
        });
      },
      'stop listening': () => {
        this.zone.run(() => {
          this.string$.next('stop listening');
          this.system$.next("Stopped listening.");
        });
      },
    }
    const navigationCommands = {
      'go to (shopping) :nav': (res: any) => {
        this.zone.run(() => {
          this.navigation$.next(res);
          this.system$.next("Navigating to " + res + " page.");
        });
      },
    }
    const cartCommands = {
      'add *item': (res: any) => {
        this.zone.run(() => {
          console.log(res);
          this.item$.next(res);
          this.system$.next("Adding " + res + " to cart.");
        });
      },
      'clear (shopping) cart': () => {
        this.zone.run(() => {
          this.cart$.next('clear cart');
          this.system$.next("Clearing cart.");
        });
      },
      'clear (shopping) card': () => {
        this.zone.run(() => {
          this.cart$.next('clear cart');
          this.system$.next("Clearing cart.");
        });
      },
      'remove *item': (res: any) => {
        this.zone.run(() => {
          res = "remove: " + res;
          this.cart$.next(res);
          this.system$.next("Removing " + res + " from cart.");
        });
      },
      'delete *item': (res: any) => {
        this.zone.run(() => {
          res = "remove: " + res;
          this.cart$.next(res);
          this.system$.next("Removing " + res + " from cart.");
        });
      },
      'increase quantity *item': (res: any) => {
        this.zone.run(() => {
          res = "quantity up: " + res;
          this.cart$.next(res);
          this.system$.next("Increasing quantity of " + res + ".");
        });
      },
      'decrease quantity *item': (res: any) => {
        this.zone.run(() => {
          res = "quantity down: " + res;
          this.cart$.next(res);
          this.system$.next("Decreasing quantity of " + res + ".");
        });
      },
    };
    annyang.addCommands(controlCommands);
    annyang.addCommands(navigationCommands);
    annyang.addCommands(cartCommands);
    annyang.addCommands(dutchCommands);

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

  getPage(): void {
    this.page$.next(
      this.location.path()
    );
  }

  setPage(page: string): void {
    this.page$.next(page);
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


@Injectable()
export class TalkService {
  private synthesis: SpeechSynthesis;

  constructor() {
    this.synthesis = window.speechSynthesis;
  }

  speak(text: string): void {
    if (this.synthesis && text) {
      const utterance = new SpeechSynthesisUtterance(text);
      this.synthesis.speak(utterance);
    }
  }

  cancel(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }
}
