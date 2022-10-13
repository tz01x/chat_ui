
import { Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';


export class SocketService {
  public socketStatus = true;
  roomId!: string;
  constructor(private socket: Socket) { 
    this.checkStatus();
   
  }

  checkStatus() {
    this.socket.on("connect", () => {
      this.socketStatus = true;
      this.roomId&&this.setRoom(this.roomId);
    });
    this.socket.on("disconnect", () => {
      this.socketStatus = false;
    });
  }

  setRoom(roomId:string){
    this.roomId= roomId;
    this.socket.emit('setRoom',{roomId:roomId});
  }
  sendMessage(data:any){
    this.socket.emit('sendMessage',data)
  }
  getMessages(){
    // this.socket.fromEvent('receiveMessage').subscribe((value:any)=>{
    //   console.log(value);
    // })
    return this.socket.fromEvent('receiveMessage');
  }
  close(){
    this.socket.disconnect()
  }
}

export const socketFactory= ()=>{
  return new SocketService(new Socket({ url: environment.chatSocketUrl, options: {} }))
}
