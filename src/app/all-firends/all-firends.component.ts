import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AppStateService } from '../services/app-state.service';
import { debounceTime, of, switchMap, BehaviorSubject } from 'rxjs';
import { StoreService } from '../services/store.service';
import { FriendsListItem, ReloadStatus, User, UserListItem } from '../interfaces';

@Component({
  selector: 'app-all-firends',
  templateUrl: './all-firends.component.html',
  styleUrls: ['./all-firends.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush,
})
export class AllFirendsComponent implements OnInit {

  searchFormControl: FormControl;

  private allFriendsSubject = new BehaviorSubject<FriendsListItem[]>([]);
  public allFriendsList$ = this.allFriendsSubject.asObservable();

  private requestedFriendsSubject = new BehaviorSubject<FriendsListItem[]>([]);
  public requestedFriends$ = this.requestedFriendsSubject.asObservable();

  constructor(
    public appState: AppStateService,
    private router: Router,
    private db: StoreService,
  ) {
    this.searchFormControl = new FormControl('');
  }

  ngOnInit(): void {
    this.valueChangeHandler();
    this.allFriendsList$ = this.db.getAllFriends(this.appState.userDocID, '');
    this.requestedFriends$ = this.db.getAllFriendRequest(this.appState.userDocID,'');
  }

  valueChangeHandler() {
    this.allFriendsList$ = this.searchFormControl.valueChanges
      .pipe(
        debounceTime(500),
        switchMap((value: string) => {
         return this.db.getAllFriends(this.appState.userDocID, value);
          
        })
      )


  }

  goBack() {
    this.router.navigate(['/home'])
  }

  actionFunction(user:  FriendsListItem) {

    if (this.appState.userDocID)
      return this.db.removeFriends(this.appState.userDocID, user.uid);
    return of(null)
  }

  onComplectAction(user: FriendsListItem) {
    this.appState.showNonfiction('Request send to ' + user.displayName);
  }

  onErrorAction(user: FriendsListItem, error: any) {
    console.error(error);
    this.appState.showError(JSON.stringify(error));
  }

  onNextAction(user: FriendsListItem, value: any) {
    console.log('opt to next action ', value);
  }

  acceptActionFunction(user:  FriendsListItem) {
    if (this.appState.userDocID)
      return this.db.acceptFriends(this.appState.userDocID, user.uid);
    return of(null)
  }

  onNextAcceptAction(user: FriendsListItem, value: any) {
    this.appState.showNonfiction('Request Accepted');
    this.appState.reloadRequired$.next(ReloadStatus.CHAT_LIST);
  }
  onErrorAcceptAction(user: FriendsListItem, error: any) {
    console.error(error);
    this.appState.showError(JSON.stringify(error));
  }


}
