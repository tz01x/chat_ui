import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

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
export class ChatBubbleComponent implements OnInit {
  @Input()owner:boolean=false;
  @Input()textMessage:string|undefined;
  @Input()timeStamp:string|number|undefined;
  
  constructor() { }

  ngOnInit(): void {
  }

}
