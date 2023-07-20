import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { delay, filter, from, map, Observable, of, switchMap, tap } from 'rxjs';
import { AddedFriends, AddUser, ChatRoomItem, ReloadStatus } from '../interfaces';
import { InteractiveLoading } from '../loading';
import { LoadingSpinerComponent } from '../loading-spiner/loading-spiner.component';
import { AppStateService } from '../services/app-state.service';
import { StoreService } from '../services/store.service';
import { ChatRoomSelectorService } from '../services/chat-room-selector.service';

@Component({
  standalone:true,
  imports:[
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    LoadingSpinerComponent,
  ],
  selector: 'app-chatlist',
  templateUrl: './chatlist.component.html',
  styleUrls: ['./chatlist.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatlistComponent implements OnInit, OnDestroy {
  @Input() renderInAside = false;

  chatRooms$:Observable<ChatRoomItem[]>=of([]);
  loader = new InteractiveLoading();

  constructor(
    private _route:Router,
    public appState:AppStateService,
    private db:StoreService,
    private _chatRoomSelectorService: ChatRoomSelectorService,
  ) { 

    
  }

  ngOnInit(): void {


    if(!this.renderInAside && this.appState.isViewPortLarge){
      return;
    }
    if(this.appState.userDocID){

      this.chatRooms$ = this.appState.reloadRequired$
      .pipe(
        filter(val=> val===null || val===ReloadStatus.CHAT_LIST),
        switchMap((_)=>{
          if(this.appState.userDocID)
            return this.loader.showLoaderUntilCompleted(
              this.db.getChatRoomList(this.appState.userDocID)
            );
          return of([]);
        }),
      )
       

    }
  }


  activeRoom(room:ChatRoomItem){
    console.log('emitRoomActive')
    this._chatRoomSelectorService.setCurrentChatRoom(room);
    
  }

  ngOnDestroy(): void {
      console.log('emitRoomDestroy');
  }


}
