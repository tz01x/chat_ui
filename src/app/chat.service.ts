import { Injectable } from '@angular/core';
import { map, of } from 'rxjs';
interface Message{
  to:string,
  from:string,
  textMessage:string,
  time:string|number,
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  allMessage:Message[] = []
  constructor() { }

  getMessage(senderId:string|null,receiverId:string|null){

    return this.allMessage.filter(value=> value.to==receiverId).map((value)=>{
      return {
        username:value.from,
        textMessage:value.textMessage,
        timeStamp:value.time,
      }
    })
  }

  pushMessage(senderId:string,receiverId:string,textMessage: string){
    this.allMessage.push({
      to:receiverId,
      from:senderId,
      textMessage:textMessage,
      time: Date.now()

    })
  }
}
