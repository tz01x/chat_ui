import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, RouterModule } from '@angular/router';
import { catchError, combineLatest, Observable, BehaviorSubject, tap, Subject, takeUntil, EMPTY, withLatestFrom, filter, Subscription, map } from 'rxjs';
import { AddUser, IChatRoom, IGetChatRoomResponse, iMessage, IToken, User } from '../interfaces';
import { AppStateService } from '../services/app-state.service';
import { ChatService } from '../services/chat.service';
import { ChatSocket, chatSocketFactory } from '../services/sockets/chat-socket';
import { StoreService } from '../services/store.service';
import { ChatBubbleComponent } from '../chat-bubble/chat-bubble.component';
import { ContentRefDirective } from '../content-ref.directive';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollDirective } from '../infinite-scroll.directive';
import { UserAvaterComponent } from '../components/user-avater/user-avatar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ChatRoomInfoComponent } from '../chat-room-info/chat-room-info.component';
import { ChatRoomService } from '../services/chatroom.service';
import { TokenService } from '../services/token.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ChatBubbleComponent,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    InfiniteScrollDirective,
    UserAvaterComponent,
    RouterModule,
    MatSidenavModule,
    ChatRoomInfoComponent,
  ],
  selector: 'app-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrls: ['./chat-view.component.scss'],
})
export class ChatViewComponent implements OnInit, OnDestroy {
  chatRoomId: string | null = null;
  roomId: string | null = null;
  textMessage: string | null = null;
  displayName: string | null = null;
  messageListSubject$ = new BehaviorSubject<iMessage[]>([]);
  messageList$ = this.messageListSubject$.asObservable();
  restDistancePointer: any
  otherPerson: User | null = null;
  chatSocket!: ChatSocket;
  apiLimit = 50;
  apiOffset = 0;
  isNextPageAvailable = true;
  activeUserStatus$!: Observable<boolean>;
  destroy$: Subject<boolean> = new Subject<boolean>();
  subscriptions: Subscription[] = [];
  drawer = false;


  @ViewChild(InfiniteScrollDirective, {read:ElementRef }) scroll!: ElementRef;

  currentChatRoom$ = this._chatRoomService.getChatRoom();



  constructor(
    private _Activatedroute: ActivatedRoute,
    private _router: Router,
    public chatService: ChatService,
    public appState: AppStateService,
    private _db: StoreService,
    private _chatRoomService: ChatRoomService,
    private _tokenService: TokenService,

  ) {

    // this.subscriptions.push(
    //   this._Activatedroute.paramMap
    //     .subscribe((params) => {


    //       this.onRouteChange(params, val);


    //     })
    // );

    this.subscriptions.push(
      combineLatest([this._Activatedroute.paramMap,this._tokenService.token])

        .subscribe(([params,tkn]) => {
          this.onRouteChange(params,tkn);
        }));
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }  

  private onRouteChange(params: ParamMap, token:IToken|null) {

    // console.log(chatRoom, params);
    // if (!chatRoom) return;
    this.roomId = params.get('roomId');
    this.chatRoomId = params.get('chatRoomId');
    // this.displayName = chatRoom?.display_property.displayName || '';


    if (!this.roomId || !this.chatRoomId || !this.appState.userDocID ||!token) {
      return
    }

    this._db.getChatRoom(this.appState.userDocID, this.roomId)
      .pipe(
        takeUntil(this.destroy$),
        tap((room) => {
          if (!room.found) {
            this._router.navigate(['/home']);
            this.appState.showNonfiction('Does not exist');
          }

        }),
      ).subscribe(room => {
        if (room.found) {
          this._chatRoomService.setChatRoom(room.chatRoom);
        }
      })



    this.restDistancePointer = !this.restDistancePointer;
    this.isNextPageAvailable = true;
    this.apiLimit = 50;
    this.apiOffset = 0;

    this.messageListSubject$.next([]);
    this.loadAllMessages();

    this.chatSocket = this.constructSocket(this.appState.userDocID,token);
    this.chatSocket.setRoom(this.appState.userDocID, this.roomId, this.chatRoomId);
    this.chatSocket.getUserStatus(this.chatRoomId);
    this.activeUserStatus$ = this.chatSocket.receiveUserState();

    this.loadMessageFromObservable(this.chatSocket.getMessages());
    this.loadMessageFromObservable(this.chatSocket.getLastSentMessage());

  }


  constructSocket(uid:string, token:IToken) {
    if (this.chatSocket) {
      this.chatSocket.close();
      return chatSocketFactory(uid, token.access_token);
    } else {
      return chatSocketFactory(uid, token.access_token);
    }
  }

  lastComponentViewRender() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {

      this.scroll.nativeElement.scrollTop = this.scroll?.nativeElement.scrollHeight;
    } catch (err) { }
  }

  sendMessage(event: any) {
    const { code, keyCode, type } = event;
    if (!this.roomId || !this.chatRoomId || !this.appState.userDocID)
      return;

    if ((code == 'Enter' || type == 'click') && this.textMessage) {

      this.chatSocket?.sendMessage({
        value: this.textMessage,
        msg_type: 'TEXT',
        chat_room_id: this.chatRoomId,
        user_uid: this.appState.userDocID,
      })
      this.textMessage = '';
    }

  }

  loadAllMessages() {
    if (!this.roomId) {
      return;
    }
    if (!this.isNextPageAvailable)
      return;


    this._db.getMessages(this.roomId, this.apiLimit, this.apiOffset)
      .pipe(
        catchError(error => {
          this.appState.networkErrorHandler(error);
          this._router.navigate(['/home/message']);
          return EMPTY;
        }),
        tap((queryData) => {
          if (!queryData) {
            return;
          }
          this.isNextPageAvailable = !!queryData.next;
          this.apiOffset += this.apiLimit
          this.messageListSubject$.next([...queryData.results.reverse(), ...this.messageListSubject$.getValue()]);
        }),
      ).subscribe();
  }

  loadMessageFromObservable(obs$: Observable<iMessage>) {
    obs$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      const messages = this.messageListSubject$.getValue();
      let newData:any = [];
      if(data.status=='error'){
          newData = messages.map(v=>{
            if(v.id == data.id){
              return {...v,status:'error'}
            }
            return v
          })
        
      }else{
        newData = [...messages, data];
      }
      this.messageListSubject$.next(newData);
    })
  }


  goBack() {
    this._router.navigate(['home'])
  }

  onScrollUp() {
    this.loadAllMessages();
  }

  openInfoPanel() {
    this.drawer = !this.drawer;
    console.log(this.drawer);
  }

  ngOnDestroy(): void {
    this.chatSocket?.close();
    this.destroy$.next(true);
    this.messageListSubject$.unsubscribe();
    this.destroy$.unsubscribe()
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    })
  }


  msgTrackBy(idx:any,item:iMessage){
    return item.id;
  }

}
