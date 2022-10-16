import { Injectable } from '@angular/core';
import { BehaviorSubject, of, Subject, switchMap, timer } from 'rxjs';
import { Notification, NotificationType, User } from '../interfaces';
import { NotificationService } from './notification.service';
import { AppSocket } from './sockets/app-socket';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private darkModeSubject = new BehaviorSubject<boolean>(false);
  darkMode$ = this.darkModeSubject.asObservable();
  isViewPortLarge: boolean = true;
  userDocID: string | null = null;
  isAuthUser = new BehaviorSubject(false);
  hasError = false;
  user: User | null = null;
  expiration: Date | null = null;
  appDrawer = false;
  reloadRequired$ = new BehaviorSubject<number | null>(null);
  socketConn = AppSocket.appSocketFactory();

  constructor(private notificationService: NotificationService) {
    this.socketConn.notification().subscribe((data: Notification) => {
      const { content, reloadRequired, reloadStatus, type } = data;

      if (type !== NotificationType.ERROR) {
        if (reloadRequired) {
          this.reloadRequired$.next(reloadStatus)
        }
        this.showNonfiction(content);
      } else {
        this.showError(content);
      }
    })
  }

  setUserDocID(id: string) {
    this.userDocID = id;
    localStorage.setItem('docID', id);
    this.socketConn.setActiveUser(this.userDocID);
  }

  setUser(user: User) {
    this.user = user;
    this.expiration = this.addDays(new Date(), 5);
    this.isAuthUser.next(true);
    this.storeUserInfo();
  }

  addDays(date: Date, days: number) {
    date.setDate(date.getDate() + days);
    return date;
  }

  storeUserInfo() {
    localStorage.setItem('userinfo', JSON.stringify(this.user));
    localStorage.setItem('expiration', JSON.stringify(this.expiration?.toUTCString()));
  }


  loadUserDocID() {
    this.userDocID = localStorage.getItem('docID');
    this.userDocID && this.socketConn.setActiveUser(this.userDocID);
  }

  loadUserInfo() {

    const userInfo = localStorage.getItem('userinfo');
    if (userInfo) {
      this.user = JSON.parse(userInfo);
    }
    const exp = localStorage.getItem('expiration');
    if (exp) {
      this.expiration = new Date(exp)
    }
    if (this.user && this.expiration && this.expiration > new Date()) {
      this.isAuthUser.next(true);
      this.loadUserDocID();
      return true;
    }
    this.clearUserInfo();
    return false;

  }

  clearUserInfo() {
    localStorage.clear();
  }

  toggleDraw() {
    this.appDrawer = !this.appDrawer;
  }

  drawerClose() {
    this.appDrawer = false;
  }

  showError(errorText: any) {
    this.notificationService.openSnackBar(errorText, 'error')
  }

  showNonfiction(text: any) {
    this.notificationService.openSnackBar(text, 'success')
  }

  toggleDarkMode() {

    this.darkModeSubject.next(!this.darkModeSubject.getValue())
  }



}
