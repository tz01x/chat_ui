import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-bubble',
  templateUrl: './chat-bubble.component.html',
  styleUrls: ['./chat-bubble.component.scss']
})
export class ChatBubbleComponent implements OnInit {
  @Input()owner:boolean=false;
  @Input()textMessage:string|undefined;
  @Input()timeStamp:string|number|undefined;
  
  constructor() { }

  ngOnInit(): void {
  }

}
