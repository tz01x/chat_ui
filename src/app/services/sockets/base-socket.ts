import { Socket } from 'ngx-socket-io';

export class SocketService {
    public socketStatus = true;
  
    constructor(protected socket: Socket) { 
      this.checkStatus();

    }
  
    checkStatus() {
      this.socket.on("connect", () => {
        this.onConnected();
      });
      this.socket.on("disconnect", () => {
        this.onDisconnected();
      });
    }
  
    onConnected(){
      this.socketStatus = true;
    }
  
    onDisconnected(){
      this.socketStatus = false;
    }
  
    close(){
      this.socket.disconnect()
    }
  }