import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IChatRoom } from '../interfaces';
import { UserAvaterComponent } from '../components/user-avater/user-avatar.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-chat-room-info',
  standalone: true,
  imports: [UserAvaterComponent,MatButtonModule,NgIf],
  templateUrl: './chat-room-info.component.html',
  styleUrls: ['./chat-room-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatRoomInfoComponent implements OnInit {
  @Input() chatRoom!: IChatRoom;

  constructor() { }

  ngOnInit(): void {
  }

}
