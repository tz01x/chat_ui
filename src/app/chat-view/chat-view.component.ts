import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { of, from, map, Observable, BehaviorSubject, tap } from 'rxjs';
import { AddUser, Message, User } from '../interfaces';
import { AppStateService } from '../services/app-state.service';
import { ChatService } from '../services/chat.service';
import { socketFactory,SocketService } from '../services/socket.service';
import { StoreService } from '../services/store.service';
import { Socket } from 'ngx-socket-io';
import { ChatBubbleComponent } from '../chat-bubble/chat-bubble.component';
import { ContentRefDirective } from '../content-ref.directive';
import { environment } from 'src/environments/environment';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  standalone:true,
  imports:[
    CommonModule,
    ChatBubbleComponent,
    MatIconModule,
    MatButtonModule,
    FormsModule,
  ],
  selector: 'app-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrls: ['./chat-view.component.scss'],
})
export class ChatViewComponent implements OnInit, AfterViewChecked,OnDestroy {
  docId: string | null = null;
  roomId: string | null = null;
  textMessage:string|null = null;
  private messageListSubject= new BehaviorSubject<Message[]>([]);
  messageList$ = this.messageListSubject.asObservable();
  otherPerson: User | null = null;
  chatSocket:SocketService|undefined;

  @ViewChild('scroll', { static: true }) scroll: any;
  @ViewChild(ContentRefDirective,{static:true}) messageListViewChildRef!: ContentRefDirective;


  constructor(
    private _Activatedroute: ActivatedRoute,
    private _router: Router,
    public chatService: ChatService,
    public appState: AppStateService,
    private db:StoreService,
    
  ) {
    
    this._Activatedroute.paramMap.subscribe(params => {
      this.onRouteChange(params, db);
    });

  }

   ngOnInit(): void {
    this.scrollToBottom();
  }

  private onRouteChange(params: ParamMap, db: StoreService) {
    this.chatSocket = this.constructSocket();
    this.docId = params.get('docId');
    this.roomId = params.get('roomId');

    if (this.docId && this.roomId) {
      this.messageListViewChildRef?.viewContainerRef.clear();
      this.chatSocket?.setRoom(this.roomId);

      const tmp = this.chatSocket?.getMessages();
      tmp && this.loadMessageFromObservable(tmp);

      db.getUserWithDocId(this.docId)
        .subscribe({
          next: (value) => {
            this.otherPerson = value;
            this.loadMessage(this.roomId);
          },
          error: (error) => this.appState.showError('Error! Invalid Id')
        });

    }
  }



  constructSocket(){
    if(this.chatSocket){
      this.chatSocket.close();
      return socketFactory();
    }else{
      return socketFactory();
    }
  }

  ngAfterViewChecked() {
    
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.scroll.nativeElement.scrollTop = this.scroll?.nativeElement.scrollHeight;
    } catch (err) { }
  }

  sendMessage(event: any) {
    const { code, keyCode, type } = event;
    if(!this.roomId)
      return;

    if ((code == 'Enter' || type == 'click') && this.textMessage) {
      this.chatSocket?.sendMessage({
        from_uid:this.appState.user?.uid,
        content:this.textMessage,
        roomId:this.roomId,
        createdAt:Date.now()
      })
      this.textMessage = '';


    }

  }

  loadMessage(roomId:string|null){
    if(!roomId){
      return;
    }

    this.db.getMessages(roomId,50)
      .pipe(tap((queryData)=>{
        this.messageListSubject.next(queryData.results.reverse());
      })).subscribe();
  }

  loadMessageFromObservable(obs$:Observable<any>){
    obs$.subscribe((data)=>{
      const messages = this.messageListSubject.getValue();
      this.messageListSubject.next([...messages,data as Message]);
      this.scrollToBottom();
    })
  }


  goBack(){
    this._router.navigate(['home'])
  }

  ngOnDestroy(): void {
    console.log('destroying chatview')
    this.chatSocket?.close();
  }

}
