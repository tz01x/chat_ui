import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserMultiSelectComponentComponent } from '../multi-select-component/multi-select-component.component';
import { MULTI_SELECT_SERVICE_TOKEN } from 'src/app/injection-tokens';
import { ChatRoomService } from '../../services/chatroom.service';
import { MatButtonModule } from '@angular/material/button';
import { AppStateService } from 'src/app/services/app-state.service';

@Component({
  selector: 'app-add-members-to-grp',
  standalone: true,
  imports: [
    MatButtonModule,
    UserMultiSelectComponentComponent,
  ],
  providers: [
    {
      provide:MULTI_SELECT_SERVICE_TOKEN,
      useExisting:ChatRoomService
    }
  ],
  templateUrl: './add-members-to-grp.component.html',
  styleUrls: ['./add-members-to-grp.component.scss']
})
export class AddMembersToGrpComponent implements OnInit {

  private chatRoomService = inject(ChatRoomService);
  private appStatus = inject(AppStateService);


  selectedUids:string[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  selectedMembers(uids:string[]){
    this.selectedUids = [...uids];
  }

  addMember(){
    this.chatRoomService.addPeopleToChatRoom(this.selectedUids)
    .subscribe(res=>{
      if(res){
        this.appStatus.showNonfiction('Successfully added');
        this.chatRoomService.clearSelectionSubject.next('clear-input-items')
        this.chatRoomService.refresh.next(1);
      }
    })
  }

}
