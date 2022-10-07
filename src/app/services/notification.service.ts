import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from '../components/notification/notification.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  durationInSeconds = 5;
  constructor(private _snackBar: MatSnackBar) { }

  openSnackBar(message:string,type:'error'|'success') {
    this._snackBar.openFromComponent(NotificationComponent, {
      data: {
        message,
        type
      },
      panelClass:type,
      verticalPosition:'top',
      horizontalPosition:'right',
      // duration: this.durationInSeconds * 1000,
    });
  }
}
