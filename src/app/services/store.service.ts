import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { user } from '@angular/fire/auth';
import { Firestore,collection,collectionData,addDoc,query, where, getDoc, getDocs, orderBy, doc, limit, serverTimestamp, onSnapshot } from '@angular/fire/firestore';

import { from ,of,Observable, map, catchError, EMPTY,tap,share,throwError, first, retry} from 'rxjs';
import { environment } from 'src/environments/environment';
import { AddedFriends, ApiResults, FriendsListItem, Message, User, UserListItem } from '../interfaces';
@Injectable({
  providedIn: 'root'
})
export class StoreService {
  userCollection:any = null; 
  
  constructor(private fireStore:Firestore,private http:HttpClient) { 
    this.userCollection = collection(this.fireStore,'user');
  }
  
  async userExits(data:User){

    const q = query(this.userCollection,where('uid','==',data.uid));
    const docs = await getDocs(q);
    if(docs.size==1){
      return docs.docs[0].id;
    }
    return null;
  }

  getUserWithDocId(docId:string){
    return this.http.get<User>(`${environment.api}/get-user/${docId}`).pipe(tap(val=>{
      console.log(val);
    }))
  }

  async getMessages(roomId:string,limitNumber:number=10){

    const q = query(
      collection(this.fireStore,'/message_room/rooms/'+roomId),
      orderBy('createdAt','asc'),
      limit(limitNumber)
      )
    return await getDocs(q);
  }
  
  getMessageSnapShort(roomId:string,messageHandler:any) {
    const q = query(
      collection(this.fireStore,'/message_room/rooms/'+roomId),
      orderBy('createdAt','desc')
      )

    return onSnapshot(q,{
      next:(data)=>{
        console.log(data)
        messageHandler(

          data.docs.map((doc)=>{
            return doc.data() as Message
          })
        );
      }
    })
    
  }

  sendMessage(message:object,roomId:string){
     return addDoc(
      collection(this.fireStore,'/message_room/rooms/'+roomId),
      {
        ...message,
        createdAt:serverTimestamp(),
      }
    )
  }


  addUser(data:User){
    return this.http.post<User>(`${environment.api}/save-or-crate-user`,data);
  }

  getFriendsList(uid:string) {
   return this.http.get<AddedFriends[]>(`${environment.api}/get-add-friends/${uid}`)
   .pipe(share());
  }

  getUserList(uid:string|null,query:string,limit:number=100,offset:number=0){
    if(!uid)
      return of([])

    return this.http.get<ApiResults<UserListItem>>
      (`${environment.api}/get-users/${uid}?q=${query}&limit=${limit}&offset=${offset}`)
      .pipe(map(data=>{
        return data.results
      }));
  }

  getAllFriends(uid:string|null,query:string,limit:number=100,offset:number=0){
    if(!uid)
      return of([])

    return this.http.get<ApiResults<FriendsListItem>>
      (`${environment.api}/get-all-friends/${uid}?q=${query}&limit=${limit}&offset=${offset}`)
      .pipe(map(data=>{
        return data.results
      }));
  }

  getAllFriendRequest(uid:string|null,query:string,limit:number=100,offset:number=0){
    if(!uid)
      return of([])

    return this.http.get<ApiResults<FriendsListItem>>
      (`${environment.api}/get-all-friend-request/${uid}?q=${query}&limit=${limit}&offset=${offset}`)
      .pipe(map(data=>{
        return data.results
      }));
  }

  addFriends(uidF:string,uidS:string){
    return this.http.post(`${environment.api}/add-friends`,{
      uid_first:uidF,
      uid_second:uidS,
    }).pipe(
      retry(2),
      tap((val)=>{
      console.log(val);
    }));
  }

  removeFriends(uidF:string,uidS:string){
    return this.http.post(`${environment.api}/remove-friends`,{
      uid_first:uidF,
      uid_second:uidS,
    }).pipe(
      retry(2),
      tap((val)=>{
      console.log(val);
    }));
  }

  acceptFriends(uidF:string,uidS:string){
    return this.http.post(`${environment.api}/accept-friends`,{
      uid_first:uidF,
      uid_second:uidS,
    }).pipe(
      retry(2),
      tap((val)=>{
      console.log(val);
    }));
  }
}
