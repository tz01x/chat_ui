import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppStateService } from '../services/app-state.service';
import { debounceTime,concat, of, switchMap, BehaviorSubject, filter, combineLatest, map, startWith, from, mergeMap, tap } from 'rxjs';
import { StoreService } from '../services/store.service';
import { FriendsListItem, IAcceptedFriend, NotificationType, ReloadStatus, User, UserListItem } from '../interfaces';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AddFriendsListItemComponent } from '../components/add-friends-list-item/add-friends-list-item.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import {MatBadgeModule} from '@angular/material/badge';
import { IndicatorService } from '../services/indicator.service';

@Component({
  standalone:true,
  imports:[
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatTabsModule,
    AddFriendsListItemComponent,
    MatBadgeModule,
    
  ],
  selector: 'app-all-firends',
  templateUrl: './all-firends.component.html',
  styleUrls: ['./all-firends.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush,
})
export class AllFirendsComponent implements OnInit {

  searchFormControl = new FormControl<string>('');
  // private allFriendsSubject = new BehaviorSubject<IAcceptedFriend[]>([]);
 

  
  public requestedFriends$= combineLatest([
    this.appState.reloadRequired$.pipe(filter(v => v === null || v === ReloadStatus.FRIEND_REQUEST)),
    this.db.getAllFriendRequest(this.appState.userDocID, '')
  ]).pipe(
    map(([_, res]) => res),
  );
  public allFriendsList$ = combineLatest([
    this.appState.reloadRequired$.pipe(filter(v => v === null || v === ReloadStatus.All_FRIENDS_LIST)),
    concat(of(''), this.searchFormControl.valueChanges.pipe(debounceTime(200))),
  ]).pipe(
    switchMap(([_, q]) => {
      return this.db.getAllFriends(this.appState.userDocID, q ?? '', 100, 0);
    }));;

  constructor(
    public appState: AppStateService,
    private router: Router,
    private db: StoreService,
    public indicator:IndicatorService
  ) {
       
    this.initateDataSource();

  }

  private initateDataSource() {
    // const formChange = ;

    // this.allFriendsList$ = 

    // this.requestedFriends$ = 
  }

  ngOnInit(): void {}


  goBack() {
    this.router.navigate(['/home'])
  }

  actionFunction(user:  FriendsListItem) {

    if (this.appState.userDocID)
      return this.db.removeFriends(this.appState.userDocID, user.uid);
    return of(null)
  }

  onComplectAction(user: FriendsListItem) {
    this.appState.showNonfiction(user.displayName+' was remove from you friends list');
    this.appState.reloadRequired$.next(ReloadStatus.CHAT_LIST);
    this.appState.reloadRequired$.next(ReloadStatus.All_FRIENDS_LIST);
  }

  onErrorAction(user: FriendsListItem, error: any) {
    this.appState.networkErrorHandler(error);
  }

  onNextAction(user: FriendsListItem, value: any) {
    console.log('opt to next action ', value);
  }

  acceptActionFunction(user:  FriendsListItem) {
    if (this.appState.userDocID)
      return this.db.acceptFriends(this.appState.userDocID, user.uid);
    return of(null);
  }

  onNextAcceptAction(user: FriendsListItem, value: any) {
    this.appState.showNonfiction('Request Accepted');
    this.appState.reloadRequired$.next(ReloadStatus.CHAT_LIST);
    this.appState.reloadRequired$.next(ReloadStatus.All_FRIENDS_LIST);
    this.appState.socketConn.sendNotification({
      to:user.uid,
      from:this.appState?.userDocID,
      content:`'${this.appState.user?.displayName}' has Accepted the Request`,
      reloadRequired:true,
      reloadStatus:ReloadStatus.CHAT_LIST,
      type:NotificationType.NOTIFY
    })
  }
  
  onErrorAcceptAction(user: FriendsListItem, error: any) {
    
    this.appState.networkErrorHandler(error);

  }


}
