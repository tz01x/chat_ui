import { CommonModule } from '@angular/common';
import { Component, OnInit,Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  standalone:true,
  imports:[
    CommonModule,
     MatIconModule,
    MatButtonModule,
  ],
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data:any,public snackBarRef:MatSnackBarRef<NotificationComponent>) { }

  ngOnInit(): void {
  }

}
