import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IBaseResponse, IAcceptedFriend, IChatRoom, IMultiSelectFilterService, IMembersSplitter } from '../interfaces';
import { BehaviorSubject, filter, of, switchMap, distinctUntilChanged, catchError, tap, Subject } from 'rxjs';
import { AppStateService } from './app-state.service';

@Injectable({
  providedIn: 'root'
})
export class ChatRoomService implements IMultiSelectFilterService {

  private http = inject(HttpClient);
  private appState = inject(AppStateService);
  private currentChatRoomSub = new BehaviorSubject<IChatRoom | null>(null);
  refresh = new BehaviorSubject<number>(1);
  clearSelectionSubject = new Subject<any>();
  clearSelection$ = this.clearSelectionSubject.asObservable();


  constructor() { }


  setChatRoom(chatRoom: IChatRoom) {
    this.currentChatRoomSub.next(chatRoom);
  }

  getChatRoom() {
    return this.currentChatRoomSub.pipe(
      filter(val => val !== null),
      distinctUntilChanged()
    )
  }


  filterBySearchTerm(searchTerm: string) {
    const chatRoom = this.currentChatRoomSub.getValue();
    if (chatRoom === null) return of([]);

    return this.http.get<IAcceptedFriend[]>(`${environment.api}/get-non-added-friends-for-chat-room/${chatRoom.id}/${this.appState.userDocID}?search_term=${searchTerm}`)

  }

  getChatRoomMembers() {
    return this.getChatRoom().pipe(
      switchMap((val) => {
        return this.http.get<IMembersSplitter>(`${environment.api}/get-chat-room-members/${val?.room_id}/${this.appState.userDocID}`);
      }));
  }

  addPeopleToChatRoom(uids: string[]) {
    const chatRoom = this.currentChatRoomSub.getValue();
    if (chatRoom === null) return of(false);

    const payload = JSON.stringify({
      'chat_room_id': chatRoom.id,
      'uids': uids
    })

    return this.http.post(`${environment.api}/add-people-to-group`, payload, {
      headers: { 'Content-Type': 'application/json' },
    }).pipe(
      switchMap((_) => of(true)),
      catchError((err) => {
        this.appState.networkErrorHandler(err);
        return of(false);
      }));
  }

  remove_member(uid: string) {
    const chatRoom = this.currentChatRoomSub.getValue();
    if (chatRoom === null) return of(false);
    const payload = {
      primary_uid: this.appState.userDocID,
      chat_room_id: chatRoom.id,
      uid: uid,
    }

    return this.http.post(`${environment.api}/remove-member`, payload).pipe(
      switchMap((_) => of(true)),
      catchError((err) => {
        this.appState.networkErrorHandler(err);
        return of(false);
      }));
  }

}
