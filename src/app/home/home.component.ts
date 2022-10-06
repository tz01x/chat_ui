import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppStateService } from '../services/app-state.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public appState:AppStateService,
    private router:Router) { }

  ngOnInit(): void {
  }

  
  logout(){
    this.appState.isAuthUser.next(false);
  }

}
