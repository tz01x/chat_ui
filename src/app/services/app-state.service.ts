import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, combineLatest,takeUntil } from 'rxjs';
import { IChatRoom, Notification, NotificationType, ReloadStatus, User } from '../interfaces';
import { IndicatorService } from './indicator.service';
import { NotificationService } from './notification.service';
import { AppSocket } from './sockets/app-socket';
import { TokenService } from './token.service';

@Injectable()
export class AppStateService {
  private darkModeSubject = new BehaviorSubject<boolean>(true);
  darkMode$ = this.darkModeSubject.asObservable();
  isViewPortLarge: boolean = true;
  userDocID: string | null = null;
  isAuthUser = new BehaviorSubject(false);
  hasError = false;
  user: User | null = null;
  expiration: Date | null = null;
  appDrawer = false;
  reloadRequired$ = new BehaviorSubject<number | null>(null);
  chatRoomNames = new BehaviorSubject<any>({})
  socketConn!:AppSocket;
  destroy = new Subject<boolean>();
  constructor(private tokenService:TokenService, private notificationService: NotificationService, private indicator: IndicatorService) {

    // combineLatest([this.isAuthUser,this.tokenService.token])
    // .pipe(takeUntil(this.destroy))
    // .subscribe(([val,tkn]) => {
    //   console.log(val,tkn);
    //   if (val == true && this.userDocID && tkn) {
       
    //   } else {
    //     this.socketConn?.close();
    //   }
    // });
  }

  createAppSocketConnection(){
    const token  = this.tokenService.getTokenValue();
    if(token && this.userDocID){

      this.socketConn = AppSocket.appSocketFactory(token?.access_token,this.userDocID??'',false);
      this.socketConn.connect();
      this.socketConn.setActiveUser(this.userDocID);
      this.socketConn.notification()
      .subscribe((data: Notification) => this.notificationHandler(data));
    }else{
      console.log('application socket connection could not be set')
    }

  }

  closeSocketConnection(){
    console.log('closing .. app socket ')
    this.socketConn?.close();
  }

  notificationHandler(data: Notification) {
    const { content, reloadRequired, reloadStatus, type } = data;

    if(type==NotificationType.NEWMSG){
      const cRoomAndDisplayName:any = this.chatRoomNames.getValue();
      if(cRoomAndDisplayName[content['roomId']]){
        this.showNonfiction(`New Message From ${cRoomAndDisplayName[content['roomId']]}`);
      }
      
      return;
    }

    if (type === NotificationType.ERROR) {
      this.showErrorNotification(content);
      return;
    }


    if (reloadRequired) {
      this.reloadRequired$.next(reloadStatus);
    }


    if (reloadStatus === ReloadStatus.FRIEND_REQUEST) {
      this.indicator.incrementRequestIndicator()
    }

    this.showNonfiction(content);
  }

  setUserDocID(id: string) {
    this.userDocID = id;
    localStorage.setItem('docID', id);

  }

  setUser(user: User) {
    this.user = user;
    this.setUserDocID(user.uid);
    this.expiration = this.addDays(new Date(), 5);
    this.createAppSocketConnection();
    localStorage.setItem('userinfo', JSON.stringify(user));
    localStorage.setItem('expiration', JSON.stringify(this.expiration?.toUTCString()));
  }

  addDays(date: Date, days: number) {
    date.setDate(date.getDate() + days);
    return date;
  }

  loadUserDocID() {
    this.userDocID = localStorage.getItem('docID');
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
      this.loadUserDocID();
      this.isAuthUser.next(true);
      return true;
    }
    this.clearUserInfo();
    return false;

  }

  clearUserInfo() {
    this.user = null;
    localStorage.clear();
  }

  toggleDraw() {
    this.appDrawer = !this.appDrawer;
  }

  drawerClose() {
    this.appDrawer = false;
  }

  showErrorNotification(errorText: any) {
    this.notificationService.openSnackBar(errorText, 'error')
  }

  networkErrorHandler(error: any) {
    if (error.status == 0) {
      this.showErrorNotification('Failed to connect');
    } else {
      this.showErrorNotification(error?.error?.detail || "Server error");
    }
  }

  showNonfiction(text: any) {
    this.notificationService.openSnackBar(text, 'success')
  }

  toggleDarkMode() {

    this.darkModeSubject.next(!this.darkModeSubject.getValue());
  }



}
