import { Injectable } from '@angular/core';
import { UserCredential } from '@angular/fire/auth';
import { BehaviorSubject, of, Subject, switchMap, timer } from 'rxjs';
interface User{
  email:string|null
  displayName:string|null
  photoURL:string|null
  uid:string
  refreshToken:string
}

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  isViewPortLarge:boolean=true;
  authUser='Alex';
  isAuthUser= new BehaviorSubject(false);
  hasError=false;
  user:User|null=null;
  expiration:Date|null=null;
  appDrawer=false;
  constructor() { }

  authenticateUser(username:string,password:string){

    return timer(4000).pipe(switchMap(r=>{
      this.isAuthUser.next(true);
      this.authUser=username;
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
}