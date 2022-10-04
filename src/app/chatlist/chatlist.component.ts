import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { from, map, Observable, of, switchMap } from 'rxjs';
import { AddUser } from '../interfaces';
import { AppStateService } from '../services/app-state.service';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-chatlist',
  templateUrl: './chatlist.component.html',
  styleUrls: ['./chatlist.component.scss']
})
export class ChatlistComponent implements OnInit {
  @Input() renderInAside = false;
  public color = 'red';
  public folders = [
    {
      name:'Jack',
      updated:'10/5/2020'
    },
    {
      name:'Jonce',
      updated:'10/5/2020'
    },
    {
      name:'Tumzied',
      updated:'10/5/2020'
    },
    {
      name:'AR',
      updated:'10/5/2020'
    },
    
  ]
  peoples$:Observable<AddUser[]>=of([]);

  constructor(private _route:Router,
    public appState:AppStateService,
    private db:StoreService
  ) { }

  ngOnInit(): void {

    if(!this.renderInAside && this.appState.isViewPortLarge){
      return;
    }


    if(this.appState.userDocID){
      this.peoples$ = from(this.db.getFriendsList(this.appState.userDocID))
      .pipe(map((result)=>{
        return result.docs.map((doc)=>{
          const data = doc.data() as AddUser;
          return data;
        })
      }))
    }
  }

  message(uid:string){
    console.log(uid);
    this._route.navigate(['message',uid]);
  }

}
