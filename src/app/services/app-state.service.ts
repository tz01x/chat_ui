import { Injectable } from '@angular/core';
import { UserCredential } from '@angular/fire/auth';
import { BehaviorSubject, of, Subject, switchMap, timer } from 'rxjs';
import { AddUser, User } from '../interfaces';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private darkModeSubject = new BehaviorSubject<boolean>(false);
  darkMode$ = this.darkModeSubject.asObservable();
  isViewPortLarge:boolean=true;
  userDocID:string|null=null;
  isAuthUser= new BehaviorSubject(false);
  hasError=false;
  user:User|null=null;
  expiration:Date|null=null;
  appDrawer=false;
  reloadRequired$ = new BehaviorSubject<number|null>(null);

  constructor(private notificationService:NotificationService) { }

  authenticateUser(username:string,password:string){

    return timer(4000).pipe(switchMap(r=>{
      this.isAuthUser.next(true);
      return of({
      'token':'token',
      'username':username,
    })}));

  }

  setUser(user:User){
    this.user=user;
    this.expiration = this.addDays(new Date(),5);
    this.isAuthUser.next(true);
    this.storeUserInfo();
  }
  addDays(date:Date,days:number){
    date.setDate(date.getDate() + days);
    return date;
  }

  storeUserInfo(){
    localStorage.setItem('userinfo',JSON.stringify(this.user));
    localStorage.setItem('expiration',JSON.stringify(this.expiration?.toUTCString()));
  }

  setUserDocID(id:string){
    this.userDocID=id;
    localStorage.setItem('docID',id);
  }

  loadUserDocID(){
    this.userDocID = localStorage.getItem('docID');
  }

  loadUserInfo(){
  
    const userInfo = localStorage.getItem('userinfo');
    if(userInfo){
      this.user=JSON.parse(userInfo);
    }
    const exp = localStorage.getItem('expiration');
    if(exp){
      this.expiration = new Date(exp)
    }
    if(this.user && this.expiration && this.expiration > new Date()){
      this.isAuthUser.next(true);
      this.loadUserDocID();
      return true;
    }
    this.clearUserInfo();
    return false;

  }

  clearUserInfo(){
    localStorage.clear();
  }

  toggleDraw(){
    this.appDrawer=!this.appDrawer;
  }
  drawerClose(){
    this.appDrawer=false;
  }

  showError(errorText:any){
    this.notificationService.openSnackBar(errorText,'error')
  }

  showNonfiction(text:any){
    this.notificationService.openSnackBar(text,'success')
  }
  toggleDarkMode(){

    this.darkModeSubject.next(!this.darkModeSubject.getValue())
  }

  

}
