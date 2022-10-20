import { Injectable } from '@angular/core';
import { BehaviorSubject,distinctUntilChanged, share, shareReplay } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class IndicatorService {
  requestIndicatorSubject = new BehaviorSubject<number>(0);
  requestIndicator$ = this.requestIndicatorSubject
                      .asObservable()
                      .pipe(
                        distinctUntilChanged(),
                        shareReplay()
                      );

  constructor() { }

  incrementRequestIndicatorByValue(value: number) {
    this.requestIndicatorSubject.next(value);
  }

  incrementRequestIndicator() {
    this.requestIndicatorSubject.next(this.requestIndicatorSubject.getValue() + 1);
  }

  clearRequestIndicator() {
    this.requestIndicatorSubject.next(0);
  }


}
