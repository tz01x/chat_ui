import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppStateService } from 'src/app/services/app-state.service';
import { ChangeDetectionStrategy } from '@angular/core';


@Component({
  selector: 'app-chat-room-search-bar',
  templateUrl: './chat-room-search-bar.component.html',
  styleUrls: ['./chat-room-search-bar.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,

  ]
})
export class ChatRoomSearchBarComponent implements OnInit {

  searchTerm!: string;
  bluerSearchTerm!: string;

  @Output() onSummit = new EventEmitter<string>();

  constructor(public appState: AppStateService) { }

  ngOnInit(): void {
  }


  submitAction(){
    this.onSummit.emit(this.searchTerm);
  }

  blurAction(event:any){
    // if(event.type=='focus'){
    //   this.searchTerm=this.bluerSearchTerm;
    // }else if(event.type=='blur'){
    //   this.bluerSearchTerm = this.searchTerm;
    //   this.searchTerm = '';
    // }
  }


}
