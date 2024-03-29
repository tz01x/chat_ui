import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { BehaviorSubject, catchError, combineLatest, concat, debounceTime, delay, distinctUntilChanged, filter, from, map, Observable, of, retry, startWith, Subject, switchMap, tap } from 'rxjs';
import { AddedFriends, AddUser, IChatRoom, ReloadStatus } from '../interfaces';
import { InteractiveLoading } from '../loading';
import { LoadingSpinerComponent } from '../loading-spiner/loading-spiner.component';
import { AppStateService } from '../services/app-state.service';
import { StoreService } from '../services/store.service';
import { ChatRoomSearchBarComponent } from '../components/chat-room-search-bar/chat-room-search-bar.component';
import { UserAvaterComponent } from '../components/user-avater/user-avatar.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  standalone: true,
  imports: [
    ChatRoomSearchBarComponent,
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    LoadingSpinerComponent,
    UserAvaterComponent,
    MatTooltipModule,
  ],

  selector: 'app-chatlist',
  templateUrl: './chatlist.component.html',
  styleUrls: ['./chatlist.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatlistComponent implements OnInit, OnDestroy {
  @Input() renderInAside = false;

  chatRooms$!: Observable<IChatRoom[]>
  loader = new InteractiveLoading();
  searchTermChangeSubject = new Subject<string>();
  searchTerm$ = this.searchTermChangeSubject.asObservable();
  refresh$ = new BehaviorSubject<boolean>(true);

  constructor(
    private _route: Router,
    public appState: AppStateService,
    private db: StoreService,
  ) {


  }

  ngOnInit(): void {


    if (!this.renderInAside && this.appState.isViewPortLarge) {
      return;
    }



    // emit null fist then the search item value
    const searchTerm$ = concat(
      of(null),
      this.searchTerm$.pipe(
        debounceTime(500),
        distinctUntilChanged(),
      ));

    // since search term observable wont complete immediately
    // thats whey we wrap loader.showLoaderUntilComplete function with data retrieve function
    this.chatRooms$ = combineLatest([
      concat(of(true), this.refresh$.pipe(debounceTime(400))),
      this.appState.reloadRequired$.pipe(filter(v=>v==null||v===ReloadStatus.CHAT_LIST)),
      searchTerm$,
    ]).pipe(
      switchMap(([_,__,value]) => {
        return this.loader.showLoaderUntilCompleted(
          this.db.getChatRoomList(this.appState.userDocID || '', value)
            .pipe(
              retry(3),
              catchError((err) => {
              this.appState.networkErrorHandler(err);
              return of([]);
            })
            ));
      }),
      tap(items=>{
        
        const chatRoomIdAndDisplayName:any={}
        items.forEach((v:IChatRoom)=>{
          return chatRoomIdAndDisplayName[v.room_id]=v.display_property.displayName
        });
        this.appState.chatRoomNames.next(chatRoomIdAndDisplayName)
      })
    );


  }


  searchingForChatRoom(display_name: string) {
    console.log('searching for chat room', display_name);
    this.searchTermChangeSubject.next(display_name);
  }

  refreshChatRoomList() {
    this.refresh$.next(true);
  }

  listTrackBy(idx:any,item:IChatRoom){
    return item.room_id;
  }

  ngOnDestroy(): void {
  }


}
