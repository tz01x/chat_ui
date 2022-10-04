import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AddUser } from '../interfaces';
import { AppStateService } from '../services/app-state.service';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrls: ['./chat-view.component.scss']
})
export class ChatViewComponent implements OnInit, AfterViewChecked {
  username: string | null = null;
  textMessage: string | undefined;
  otherPerson: AddUser | null = null;
  

  @ViewChild('scroll', { static: true }) scroll: any;


  constructor(
    private _Activatedroute: ActivatedRoute,
    private _router: Router,
    public chatService: ChatService,
    public appState: AppStateService
  ) {

    this._Activatedroute.paramMap.subscribe(params => {
      this.username = params.get('username');
      if (!this.username) {
        this._router.navigate(['message']);
      }
      
      const state = this._router.getCurrentNavigation()?.extras.state as {other: AddUser}
      this.otherPerson = state.other;
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
    if (code == 'Enter' || type == 'click') {
      if (this.textMessage && this.username) {

        this.chatService.pushMessage(
          'abcd',
          this.username,
          this.textMessage
        );
        this.textMessage = "";

      }
    }

  }

  goBack(){
    this._router.navigate(['message'])
  }

}
