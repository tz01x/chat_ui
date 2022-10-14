import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AppStateService } from '../services/app-state.service';

@Component({
  standalone:true,
  imports:[
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
  ],
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public appState:AppStateService) { }

  ngOnInit(): void {
  }

}
