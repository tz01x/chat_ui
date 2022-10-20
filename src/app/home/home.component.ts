import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterModule } from '@angular/router';
import { ChatlistComponent } from '../chatlist/chatlist.component';
import { HeaderComponent } from '../header/header.component';
import { AppStateService } from '../services/app-state.service';
import {MatBadgeModule} from '@angular/material/badge';
import { IndicatorService } from '../services/indicator.service';

@Component({
  standalone:true,
  imports:[
    CommonModule,
    RouterModule,
    ChatlistComponent,
    HeaderComponent,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatBadgeModule
  ],
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public appState:AppStateService,
    private router:Router,
    public indicator:IndicatorService,
    ) { }

  ngOnInit(): void {
  }

  
  logout(){
    this.appState.isAuthUser.next(false);
  }

}
