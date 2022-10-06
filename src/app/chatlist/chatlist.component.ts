import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { from, map, Observable, of, switchMap } from 'rxjs';
import { AddUser } from '../interfaces';
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

  peoples$:Observable<AddUser[]>=of([]);
  loader!: InteractiveLoading;

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
      this.loader = 
      new InteractiveLoading(
        from(this.db.getFriendsList(this.appState.userDocID))
        .pipe(map((result)=>{
          return result.docs.map((doc)=>{
            const data = doc.data() as AddUser;
            return data;
          })
        }))
      );
      this.peoples$ =  this.loader.obs$;

    }
  }

  message(uid:string){
    console.log(uid);
    this._route.navigate(['message',uid]);
  }


}
