import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { IChatRoom } from '../interfaces';
import { UserAvaterComponent } from '../components/user-avater/user-avatar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MembersListComponent } from '../components/members-list/members-list.component';

@Component({
  selector: 'app-chat-room-info',
  standalone: true,
  imports: [
    UserAvaterComponent,
    MatButtonModule,
    NgIf,
    MatSidenavModule,
    MembersListComponent,
  ],
  templateUrl: './chat-room-info.component.html',
  styleUrls: ['./chat-room-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatRoomInfoComponent implements OnInit {
  @Input() chatRoom!: IChatRoom;
  isPageOpen: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  openPage(page:string){
    this.isPageOpen =  !this.isPageOpen;
  }

}
