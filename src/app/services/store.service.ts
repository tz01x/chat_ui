import { Injectable } from '@angular/core';
import { user } from '@angular/fire/auth';
import { Firestore,collection,collectionData,addDoc,query, where, getDoc, getDocs, orderBy, doc, limit, serverTimestamp, onSnapshot } from '@angular/fire/firestore';
import { from ,of,Observable, map} from 'rxjs';
import { Message, User } from '../interfaces';
@Injectable({
  providedIn: 'root'
})
export class StoreService {
  userCollection:any = null; 
  
  constructor(private fireStore:Firestore) { 
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

  async getUserWithDocId(docId:string){
    const docRef = doc(this.fireStore,'user',docId);
    const docSnp = await getDoc(docRef);
    if(docSnp.exists()){
      return docSnp.data() as User;
    }
    // todo: emit event to user not found.
    throw Error('No User Found')
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


  async addUser(data:User){
    const id = await this.userExits(data);
    if (id===null){
      const docRef = await addDoc(this.userCollection,data);
      return docRef.id;
    }
    return id;
  }

  getFriendsList(docID:string) {
   const q= query(
      collection(this.fireStore,`/add_user/${docID}/friends`),
      orderBy('updatedAt','desc')
    );
    return getDocs(q);
  }

}
