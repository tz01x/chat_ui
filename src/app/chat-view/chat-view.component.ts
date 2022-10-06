import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, from, map, Observable } from 'rxjs';
import { AddUser, Message, User } from '../interfaces';
import { AppStateService } from '../services/app-state.service';
import { ChatService } from '../services/chat.service';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrls: ['./chat-view.component.scss']
})
export class ChatViewComponent implements OnInit, AfterViewChecked {
  docId: string | null = null;
  roomId: string | null = null;
  textMessage:string|null = null;
  messageList$:Observable<Message[]>=of([]);
  otherPerson: User | null = null;
  

  @ViewChild('scroll', { static: true }) scroll: any;


  constructor(
    private _Activatedroute: ActivatedRoute,
    private _router: Router,
    public chatService: ChatService,
    public appState: AppStateService,
    private db:StoreService
  ) {

    this._Activatedroute.paramMap.subscribe(params => {
      this.docId = params.get('docId');
      this.roomId = params.get('roomId');
      if(this.docId && this.roomId){
        from(db.getUserWithDocId(this.docId))
        .subscribe({
          next:(value)=>{
            this.otherPerson=value;
            this.loadMessage(this.roomId);
          },
          error:this.appState.errorHandler
        })

      }
    });

   }

  ngOnInit(): void {
    this.scrollToBottom();
    // console.log(this.chatService.getMessage('tumzied',this.username||'abc'))
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

    if (code == 'Enter' || type == 'click') {

      this.db.sendMessage({
        from:this.appState.user?.displayName,
        message:this.textMessage,
      },this.roomId).then((data)=>{
        this.textMessage = '';
      }).catch(this.appState.errorHandler)

    }

  }

  loadMessage(roomId:string|null){
    if(!roomId){
      return;
    }
    // this.db.getMessageSnapShort(roomId,(data:any)=>this.loadMessageInRealTime(data));
    // return;
    this.messageList$ =from(this.db.getMessages(roomId))
      .pipe(map((queryData)=>{
        const data: Message[]=[];
        queryData.forEach(q=>{
          console.log(q.data())
          data.push(
            q.data() as Message
          );
        });
        return data;
      }));
  }

  loadMessageInRealTime(messages:Message[]){
    // this.messageList$ = [...messages];
  } 

  goBack(){
    this._router.navigate(['home'])
  }

}
