import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { UserAvaterComponent } from '../components/user-avater/user-avatar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MembersListComponent } from '../components/members-list/members-list.component';
import { ChatRoomService } from '../services/chatroom.service';

@Component({
  selector: 'app-chat-room-info',
  standalone: true,
  imports: [
    UserAvaterComponent,
    MatButtonModule,
    NgIf,
    AsyncPipe,
    MatSidenavModule,
    MembersListComponent,
    
  ],
  providers:[],
  templateUrl: './chat-room-info.component.html',
  styleUrls: ['./chat-room-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatRoomInfoComponent implements OnInit {
  chatRoomService = inject(ChatRoomService);
  chatRoom$ = this.chatRoomService.getChatRoom();
  isPageOpen: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  openPage(page:string){
    this.isPageOpen =  !this.isPageOpen;
  }

}
