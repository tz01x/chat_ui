import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrls: ['./chat-view.component.scss']
})
export class ChatViewComponent implements OnInit {
  username:string|null=null;
  constructor(private _Activatedroute:ActivatedRoute,private route:Router) { }

  ngOnInit(): void {
    
    this._Activatedroute.paramMap.subscribe(params => { 
      this.username = params.get('username');
      if(this.username?.length==0){
        // do something with if no user is selected
      }
    });
  }

}
