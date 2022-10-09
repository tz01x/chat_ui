import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { from, map, Observable, of, switchMap, tap } from 'rxjs';
import { AddedFriends, AddUser } from '../interfaces';
import { InteractiveLoading } from '../loading';
import { AppStateService } from '../services/app-state.service';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-chatlist',
  templateUrl: './chatlist.component.html',
  styleUrls: ['./chatlist.component.scss']
})
export class ChatlistComponent implements OnInit {
  @Input() renderInAside = false;

  peoples$:Observable<AddedFriends[]>=of([]);
  loader = new InteractiveLoading();

  constructor(private _route:Router,
    public appState:AppStateService,
    private db:StoreService
  ) { 

  }

  ngOnInit(): void {

    if(!this.renderInAside && this.appState.isViewPortLarge){
      return;
    }
    if(this.appState.userDocID){
      this.peoples$ =  this.loader.showLoaderUntilCompleted(
        this.db.getFriendsList(this.appState.userDocID))
        .pipe(tap((results)=>{
          console.log(results);
        }));
      

    }
  }

  message(uid:string){
    console.log(uid);
    this._route.navigate(['message',uid]);
  }


}
