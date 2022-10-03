import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AppStateService } from '../services/app-state.service';

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

  constructor(private _route:Router,public appState:AppStateService) { }

  ngOnInit(): void {
 
    
  }

  message(uid:string){
    console.log(uid);
    this._route.navigate(['message',uid]);
  }

}
