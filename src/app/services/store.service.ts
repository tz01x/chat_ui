import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { from, of, Observable, map, catchError, EMPTY, tap, share, throwError, first, retry, shareReplay, switchMap, ignoreElements } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AddedFriends, ApiResults, IChatRoom, FriendsListItem, IAcceptedFriend, IGetChatRoomResponse, iMessage, User, UserListItem } from '../interfaces';
@Injectable({
  providedIn: 'root'
})
export class StoreService {
  userCollection: any = null;
  chatList$!: Observable<IChatRoom[]>;
  constructor(private http: HttpClient) {
  }


  getUserWithDocId(docId: string) {
    return this.http.get<User>(`${environment.api}/get-user/${docId}`).pipe(tap(val => {
      console.log(val);
    }))
  }

  getMessages(roomId: string, limitNumber: number = 10, offset = 0) {
    return this.http.get<ApiResults<iMessage>>(`${environment.api}/get-messages/${roomId}?limit=${limitNumber}&offset=${offset}`)
  }

  addUser(data: User) {
    return this.http.post<User>(`${environment.api}/save-or-crate-user`, data);
  }

  getChatRoomList(uid: string, q_display_name: string | null) {
    const params = q_display_name ? `?q=${q_display_name}` : '';


    this.chatList$ = this.http.get<IChatRoom[]>(`${environment.api}/get-user-chat-rooms/${uid}${params}`)
      .pipe(shareReplay());


    return this.chatList$;
  }

  getChatRoom(uid: string, room_id: string): Observable<IGetChatRoomResponse> {
    return this.http.get<IChatRoom[]>(`${environment.api}/get-user-chat-room/${uid}/${room_id}`)
      .pipe(switchMap(res => {
        if (res.length < 1) {
          return of({ found: false, chatRoom: Object() });
        }
        return of({ found: true, chatRoom: res[0] });

      }));
  }

  getUserList(uid: string | null, query: string, limit: number = 100, offset: number = 0) {
    if (!uid)
      return of([])

    return this.http.get<ApiResults<UserListItem>>
      (`${environment.api}/get-users/${uid}?q=${query}&limit=${limit}&offset=${offset}`)
      .pipe(map(data => {
        return data.results
      }));
  }

  getAllFriends(uid: string | null, query: string, limit: number = 100, offset: number = 0) {
    if (!uid)
      return of([])

    return this.http.get<ApiResults<IAcceptedFriend>>
      (`${environment.api}/get-all-friends/${uid}?q=${query}&limit=${limit}&offset=${offset}`)
      .pipe(map(data => {
        return data.results
      }));
  }

  getAllFriendRequest(uid: string | null, query: string, limit: number = 100, offset: number = 0) {
    if (!uid)
      return of([])

    return this.http.get<ApiResults<FriendsListItem>>
      (`${environment.api}/get-all-friend-request/${uid}?q=${query}&limit=${limit}&offset=${offset}`)
      .pipe(map(data => {
        return data.results
      }));
  }

  addFriends(uidF: string, uidS: string) {
    return this.http.post(`${environment.api}/add-friends`, {
      uid_first: uidF,
      uid_second: uidS,
    }).pipe(
      retry(2),
      tap((val) => {
        console.log(val);
      }));
  }

  removeFriends(uidF: string, uidS: string) {
    return this.http.post(`${environment.api}/remove-friends`, {
      uid_first: uidF,
      uid_second: uidS,
    }).pipe(
      retry(2),
      tap((val) => {
        console.log(val);
      }));
  }

  acceptFriends(uidF: string, uidS: string) {
    return this.http.post(`${environment.api}/accept-friends`, {
      uid_first: uidF,
      uid_second: uidS,
    }).pipe(
      retry(2),
      tap((val) => {
        console.log(val);
      }));
  }

  create_group(data:any){
    return this.http.post<IChatRoom>(`${environment.api}/create-group`, data)
  }
}
