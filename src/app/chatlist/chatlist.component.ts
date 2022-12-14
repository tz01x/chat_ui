import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { filter, from, map, Observable, of, switchMap, tap } from 'rxjs';
import { AddedFriends, AddUser, ReloadStatus } from '../interfaces';
import { InteractiveLoading } from '../loading';
import { LoadingSpinerComponent } from '../loading-spiner/loading-spiner.component';
import { AppStateService } from '../services/app-state.service';
import { StoreService } from '../services/store.service';

@Component({
  standalone:true,
  imports:[
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    LoadingSpinerComponent
  ],
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

      this.peoples$ = this.appState.reloadRequired$
      .pipe(
        filter(val=> val===null || val===ReloadStatus.CHAT_LIST),
        switchMap((_)=>{
          if(this.appState.userDocID)
            return this.loader.showLoaderUntilCompleted(
              this.db.getFriendsList(this.appState.userDocID)
            );
          return of([])
        })
      )
       

    }
  }

  message(uid:string){
    this._route.navigate(['message',uid]);
  }


}
