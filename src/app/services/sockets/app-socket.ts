
import { Socket } from 'ngx-socket-io';
import { tap } from 'rxjs';
import { Notification } from 'src/app/interfaces';
import { environment } from 'src/environments/environment';
import { SocketService } from './base-socket';

export class AppSocket extends SocketService {
    uid!:string;

    override onConnected(): void {
        if(!this.socketStatus && this.uid){
            this.setActiveUser(this.uid);
        }
        this.socketStatus = true;
    } 

    setActiveUser(uid:string){
        this.socket.emit('setActiveUser',{uid});
        this.uid = uid;
    }

    notification(){
        return this.socket.fromEvent<Notification>('notification');
    }

    sendNotification(data:any){
        console.log('sendNotification..')
        this.socket.emit('sendNotification',data)
    }

    connect(){
        this.socket.connect();
    }

    static appSocketFactory(autoConnect:boolean=true) {
        return new AppSocket(new Socket({ url: environment.chatSocketUrl, options: {
            autoConnect:autoConnect
        } }))
    }

}


