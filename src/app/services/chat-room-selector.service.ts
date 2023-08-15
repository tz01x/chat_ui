import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, shareReplay } from 'rxjs';
import { IChatRoom } from '../interfaces';


@Injectable({
  providedIn: 'root'
})
export class ChatRoomSelectorService {

  #selectedRoom$ = new ReplaySubject<IChatRoom|null>();

  constructor() { }

  setCurrentChatRoom(room: IChatRoom|null) {
    this.#selectedRoom$.next(room);
  }

  getSelectedRoomObservable(): Observable<IChatRoom|null> {
    return this.#selectedRoom$.asObservable();
  }

  

}
