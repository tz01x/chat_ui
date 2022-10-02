import { Component } from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import { AppStateService } from './app-state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'chat_ui';

  smallBrakePoints = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
  ]);
  largeBrakePoints = new Map([
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge']
  ]);

  constructor(
    private breakpointObserver: BreakpointObserver,
    public appState:AppStateService,
    private router:Router){
    
    breakpointObserver
      .observe([
        ...this.largeBrakePoints.keys(),
        ...this.smallBrakePoints.keys(),
      ])
      .subscribe(result=>{
        for (const query of Object.keys(result.breakpoints)) {
          if (result.breakpoints[query]) {
            if(this.smallBrakePoints.get(query)){
              this.appState.isViewPortLarge = false;
            }else{
              this.appState.isViewPortLarge = true;
            }
          }
        }
      });

    if(appState.loadUserInfo()){
      this.router.navigate(['message']);
    }else{
      if(!window.location.pathname.match('login')){
        this.router.navigate(['login']);
      }
    }

    this.appState.isAuthUser.subscribe(isAuth=>{
      if(!isAuth){
        this.router.navigate(['login']);
        this.appState.clearUserInfo();
      }
    })
  }

  logout(){
    this.appState.isAuthUser.next(false);
  }
}
