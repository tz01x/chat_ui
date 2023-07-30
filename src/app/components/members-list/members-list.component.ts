import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { AppStateService } from 'src/app/services/app-state.service';
import { UserAvaterComponent } from '../user-avater/user-avatar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { ChatRoomService } from 'src/app/services/chatroom.service';
import { AddMembersToGrpComponent } from '../add-members-to-grp/add-members-to-grp.component';
import { BehaviorSubject, switchMap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.scss'],
  imports: [NgIf,
    NgFor,
    AsyncPipe,
    UserAvaterComponent,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatTabsModule,
    AddMembersToGrpComponent
  ]
})
export class MembersListComponent implements OnInit {

  appStatus = inject(AppStateService);
  chatRoomService = inject(ChatRoomService);
  
  chatRoom$ = this.chatRoomService.getChatRoom();
  members$ = this.chatRoomService.refresh.pipe(switchMap(() => this.chatRoomService.getChatRoomMembers()));


  constructor() { }

  ngOnInit(): void {
  }

  selectedMembers(uids: string[]) {
    console.log(uids);
  }

  removeMember(uid: string) {
    const has_confirm = confirm('Are you sure you want to remove this member');
    if(!has_confirm) return;
    this.chatRoomService.remove_member(uid)
      .subscribe((isRemove) => {
        if (isRemove) {
          this.chatRoomService.refresh.next(1);
        }
      })
  }
}
