import { CommonModule } from '@angular/common';
import { EventEmitter } from '@angular/core';
import { Output } from '@angular/core';
import { ChangeDetectionStrategy, Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { AppStateService } from '../services/app-state.service';

@Component({
  standalone:true,
  imports:[
    CommonModule,
  ],
  selector: 'app-chat-bubble',
  templateUrl: './chat-bubble.component.html',
  styleUrls: ['./chat-bubble.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatBubbleComponent implements OnInit,AfterViewInit {
  @Input()owner:boolean=false;
  @Input()textMessage:string|undefined;
  @Input()timeStamp:string|number|undefined;
  @Input()isLast:boolean|undefined;
  @Output()lastComponentViewRender=new EventEmitter<any>();
  
  constructor(public appState:AppStateService) { 
  }

  ngAfterViewInit(): void {

      if(!!this.isLast)
        this.lastComponentViewRender.emit(this.isLast);
  }
  

  ngOnInit(): void {
  }

}
