
import { Socket } from 'ngx-socket-io';
import { tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SocketService } from './base-socket';
import { iMessage, iMessagePayload } from 'src/app/interfaces';


export class ChatSocket extends SocketService{
  
  private _roomId!:string;
  private _uid!:string;
  private _connected_with_uid!:string;

  override onConnected(): void {
    if(!this.socketStatus && this._roomId && this._connected_with_uid){
      this.setRoom(this._uid, this._roomId, this._connected_with_uid);
    }
    this.socketStatus = true;
   
  }


  setRoom(uid:string,roomId:string,connected_with_uid:string){
    this._roomId= roomId;
    this._uid = uid;
    this._connected_with_uid = connected_with_uid;
    this.socket.emit('setRoom',{roomId:roomId,uid:this._uid,connected_with_uid});
  }
  sendMessage(data:iMessagePayload){
    this.socket.emit('sendMessage',data)
  }
  getMessages(){
    // this.socket.fromEvent('receiveMessage').subscribe((value:any)=>{
    //   console.log(value);
    // })
    return this.socket.fromEvent<iMessage>('receiveMessage');
  }

  getLastSentMessage(){
    return this.socket.fromEvent<iMessage>('lastSentMessage');
  }

  getUserStatus(uid:string){
    this.socket.emit('getUserStatus',{uid},(data:any)=>{
      console.log('ack,',data);
    });
  }

  receiveUserState(){
    return this.socket.fromEvent<boolean>('receiveUserState').pipe(tap(val=>{
      console.log(val)
    }))
  }

}


export const chatSocketFactory= (token='chat-room-token')=>{
  return new ChatSocket(new Socket({ url: environment.chatSocketUrl, options: {
    extraHeaders:{
      'token':token
    }
  } }))
}
