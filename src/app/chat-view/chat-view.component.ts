import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { catchError, combineLatest, Observable, BehaviorSubject, tap, Subject, takeUntil, EMPTY, withLatestFrom, filter, Subscription } from 'rxjs';
import { AddUser, IChatRoom, IGetChatRoomResponse, iMessage, User } from '../interfaces';
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
  ],
  selector: 'app-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrls: ['./chat-view.component.scss'],
})
export class ChatViewComponent implements OnInit, OnDestroy{
  chatRoomId: string | null = null;
  roomId: string | null = null;
  textMessage: string | null = null;
  displayName: string | null = null;
  messageListSubject$ = new BehaviorSubject<iMessage[]>([]);
  // messageList$ = this.messageListSubject$.asObservable();
  restDistancePointer: any
  otherPerson: User | null = null;
  chatSocket: ChatSocket | undefined;
  apiLimit = 50;
  apiOffset = 0;
  isNextPageAvailable = true;
  activeUserStatus$!: Observable<boolean>;
  destroy$: Subject<boolean> = new Subject<boolean>();
  subscriptions: Subscription[] = [];


  @ViewChild('scroll', { static: true }) scroll: any;

  currentChatRoom$!: Observable<IGetChatRoomResponse>;



  constructor(
    private _Activatedroute: ActivatedRoute,
    private _router: Router,
    public _chatService: ChatService,
    public _appState: AppStateService,
    private _db: StoreService,

  )  {

    // this.subscriptions.push(
    //   this._Activatedroute.paramMap
    //     .subscribe((params) => {
          
          
    //       this.onRouteChange(params, val);
           

    //     })
    // );
      
      this.subscriptions.push(
      combineLatest([this._Activatedroute.paramMap])
      .subscribe(([params])=>{
        this.onRouteChange(params);
      }));
  }

  ngOnInit(): void {
    this.scrollToBottom();
  }

  private onRouteChange(params: ParamMap) {

    // console.log(chatRoom, params);
    // if (!chatRoom) return;
    this.roomId = params.get('roomId');
    this.chatRoomId = params.get('chatRoomId');
    // this.displayName = chatRoom?.display_property.displayName || '';
    
    
    if (!this.roomId || !this.chatRoomId || !this._appState.userDocID) {
      return
    }
    
    this.currentChatRoom$ = this._db.getChatRoom(this._appState.userDocID,this.roomId)
    .pipe(
      tap((room)=>{
        if(!room.found) {
          this._router.navigate(['/home']);
          this._appState.showNonfiction('Does not exist');
        }

      })
    )



    this.restDistancePointer = !this.restDistancePointer;
    this.isNextPageAvailable = true;
    this.apiLimit = 50;
    this.apiOffset = 0;
  
    this.messageListSubject$.next([]);
    this.loadAllMessages();
  
    this.chatSocket = this.constructSocket();
    this.chatSocket.setRoom(this._appState.userDocID, this.roomId, this.chatRoomId);
    this.chatSocket.getUserStatus(this.chatRoomId);
    this.activeUserStatus$ = this.chatSocket.receiveUserState();

    this.loadMessageFromObservable(this.chatSocket.getMessages());
    this.loadMessageFromObservable(this.chatSocket.getLastSentMessage());




  }


  constructSocket() {
    if (this.chatSocket) {
      this.chatSocket.close();
      return chatSocketFactory();
    } else {
      return chatSocketFactory();
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
    if (!this.roomId || !this.chatRoomId || !this._appState.userDocID)
      return;

    if ((code == 'Enter' || type == 'click') && this.textMessage) {

      this.chatSocket?.sendMessage({
        value: this.textMessage,
        msg_type: 'TEXT',
        chat_room_id: this.chatRoomId,
        user_uid: this._appState.userDocID,
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
          this._appState.networkErrorHandler(error);
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
      this.messageListSubject$.next([...messages, data]);
    })
  }


  goBack() {
    this._router.navigate(['home'])
  }

  onScrollUp() {
    this.loadAllMessages();
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

  


}
