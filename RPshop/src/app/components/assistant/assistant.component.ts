import { Component } from '@angular/core';
import { SpeechService } from '../../services/speech.service';
import { TalkService } from '../../services/speech.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-assistant',
  templateUrl: './assistant.component.html'
})
export class AssistantComponent {
  assistantOn = true;
  listen: Subscription | undefined;
  system: Subscription | undefined;
  systemResult: { type: 'error' | 'result'; message: string }[] = [];
  systemResultRecieved: boolean = false;
  errorsSub: Subscription | undefined;
  errorMsg: any;
  subscription: any;
  pageSubscription: Subscription | undefined;
  href: string = '';

  constructor(public speech: SpeechService, public talk: TalkService, private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.speech.init();
    this._listen();
    this._listenErrors();
    this.speech.getPage();
    // this.speech.startListening(); // comment this line to stop listening on page load
  }

  get btnLabel(): string {
    return this.speech.listening ? 'Listening...' : 'Press to listen';
  }

  private _listenErrors() {
    this.errorsSub = this.speech.errors$
      .subscribe(err => this._setError(err));
  }

  private _setError(err?: any) {
    if (err) {
      console.log('Speech Recognition:', err);
      this.errorMsg = err.message;
      this.systemResultRecieved = true;
      this.systemResult.push({ 'type': 'error', 'message': err.message });
      this._snackBar.open('Error: ' + err.message, 'Close', { duration: 3000, });
    } else {
      this.errorMsg = null;
    }
  }

  private _listen() {
    this.listen = this.speech.string$.subscribe(text => this._setString(text));
    this.system = this.speech.system$.subscribe(res => this._setResult(res));
    this.pageSubscription = this.speech.page$.subscribe(page => this._setPage(page));
  }

  private _setPage(page: string) {
    this.href = page;
  }

  private _setString(text: string) {
    if (text) {
      console.log('Speech Recognition:', text);
    }
    if (text.includes('scroll down')) {
      window.scrollBy({
        top: 450,
        left: 0,
        behavior: 'smooth'
      })
    }
    if (text.includes('scroll up')) {
      window.scrollBy({
        top: -450,
        left: 0,
        behavior: 'smooth'
      })
    }
    if (text.includes('show assistant')) {
      this.assistantOn = true;
    }
    if (text.includes('hide assistant')) {
      this.assistantOn = false;
    }
    if (text.includes('stop listening')) {
      this.speech.abort();
    }
  }

  private _setResult(res: string) {
    if (res) {
      console.log(res);
      this.systemResultRecieved = true;
      this.systemResult.push({ 'type': 'result', 'message': res });
    }
  }

  ngOnDestroy() {
    this.errorsSub?.unsubscribe();
    this.subscription?.unsubscribe();
  }

}
