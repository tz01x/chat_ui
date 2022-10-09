import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AppStateService } from '../services/app-state.service';
import { debounceTime, of, switchMap,BehaviorSubject} from 'rxjs';
import { StoreService } from '../services/store.service';
import { User, UserListItem } from '../interfaces';

@Component({
  selector: 'app-add-friends',
  templateUrl: './add-friends.component.html',
  styleUrls: ['./add-friends.component.scss']
})
export class AddFriendsComponent implements OnInit {

  searchFormControl: FormControl;

  private filterUserSubject = new BehaviorSubject<UserListItem[]>([]);
  public filterUsers$ = this.filterUserSubject.asObservable();

  constructor(
    public appState: AppStateService,
    private router: Router,
    private db:StoreService,
  ) {
    this.searchFormControl = new FormControl('');
  }
  
  ngOnInit(): void {
    this.valueChangeHandler();
    this.filterUsers$ = this.db.getUserList(this.appState.userDocID,'');
  }

  valueChangeHandler() {
   this.searchFormControl.valueChanges
    .pipe(
      debounceTime(500),
      switchMap((value:string)=>{
        this.filterUsers$ = this.db.getUserList(this.appState.userDocID,value);
        return this.filterUsers$;
      })
    ).subscribe()
    

  }

  goBack() {
    this.router.navigate(['/home'])
  }

  actionFunction(user:UserListItem){
    
    if(this.appState.userDocID)
      return this.db.addFriends(this.appState.userDocID,user.uid);
    return of(null)
  }

  onComplectAction(user:UserListItem){
    this.appState.showNonfiction('Request send to '+user.displayName);
  }

  onErrorAction(user:UserListItem,error:any){
    console.error(error);
    this.appState.showError(JSON.stringify(error));
  }

  onNextAction(user:UserListItem,value:any){
    console.log('opt to next action ', value);
  }


}
