import { Component } from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import { AppStateService } from './services/app-state.service';
import { ChildrenOutletContexts, Router } from '@angular/router';
import { slideInAnimation } from './animation';
import { TokenService } from './services/token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
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
    private router:Router,
    private tokenService:TokenService
    ){
    
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
            this.appState.reloadRequired$.next(null);
          }
        }
      });

    if(appState.loadUserInfo() && tokenService.loadToken()){
      this.router.navigate(['home']);
    }else{
      if(!window.location.pathname.match('login')){
        this.router.navigate(['login']);
      }
    }

    this.appState.isAuthUser.subscribe(isAuth=>{
      if(!isAuth){
        this.appState.clearUserInfo();
        this.router.navigate(['login']);
      }
    })
  }

}
