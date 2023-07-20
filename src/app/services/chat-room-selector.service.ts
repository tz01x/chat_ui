import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, shareReplay } from 'rxjs';
import { ChatRoomItem } from '../interfaces';


@Injectable({
  providedIn: 'root'
})
export class ChatRoomSelectorService {

  #selectedRoom$ = new ReplaySubject<ChatRoomItem|null>();

  constructor() { }

  setCurrentChatRoom(room: ChatRoomItem|null) {
    this.#selectedRoom$.next(room);
  }

  getSelectedRoomObservable(): Observable<ChatRoomItem|null> {
    return this.#selectedRoom$.asObservable();
  }

  

}
