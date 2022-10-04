import { Injectable } from '@angular/core';
import { user } from '@angular/fire/auth';
import { Firestore,collection,collectionData,addDoc,query, where, getDoc, getDocs, orderBy } from '@angular/fire/firestore';
import { from ,of,switchMap} from 'rxjs';
import { User } from '../interfaces';
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
