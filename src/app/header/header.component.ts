import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AppStateService } from '../services/app-state.service';
import { IndicatorService } from '../services/indicator.service';
import {MatBadgeModule} from '@angular/material/badge';

@Component({
  standalone:true,
  imports:[
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
  ],
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    public appState:AppStateService,
    public indicator:IndicatorService
  ) { }

  ngOnInit(): void {
  }

}
