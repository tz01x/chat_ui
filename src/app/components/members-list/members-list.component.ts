import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { AppStateService } from 'src/app/services/app-state.service';
import { StoreService } from 'src/app/services/store.service';
import { UserAvaterComponent } from '../user-avater/user-avatar.component';
import { IChatRoomType, IMembers, IMembersSplitter } from 'src/app/interfaces';
import { Observable, catchError, of, switchMap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  standalone: true,
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.scss'],
  imports: [NgIf,
    NgFor,
    AsyncPipe,
    UserAvaterComponent,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatTabsModule,
  ]
})
export class MembersListComponent implements OnInit {
  @Input() roomId!: string;
  @Input() chatRoomType!: IChatRoomType;
  appStatus = inject(AppStateService);
  db = inject(StoreService);
  members$!: Observable<IMembersSplitter>;


  constructor() { }

  ngOnInit(): void {
    this.members$ = this.db.getChatRoomMembers(this.roomId,this.appStatus.userDocID||'')
      .pipe(catchError(() => of()));

  }

}
