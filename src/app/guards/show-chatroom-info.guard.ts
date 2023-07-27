import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppStateService } from '../services/app-state.service';

@Injectable({
  providedIn: 'root'
})
export class ShowChatroomInfoGuard implements CanActivate {
  appState = inject(AppStateService);
  router = inject(Router)
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    //   console.log('here in active router state');
    //   if(this.appState.isViewPortLarge){
    //   return true;
    // }
    let url = '/home/message';
    const regex1 = new RegExp(`(info)$`);
    const regex2 = new RegExp(`(info-full)$`);
  
    if (regex1.test(state.url)) {
      if (this.appState.isViewPortLarge) {
        return true;
      } else {
        url = state.url + '-full';
      }

    } else if (regex2.test(state.url)) {
      // navigate to /info-full only be allowed
      // when app is render in small screens
      if (this.appState.isViewPortLarge == false) {
        return true;
      } else {
        // Remove the last 5 characters ("-full") using slice

        url = state.url.slice(0, -5);
      }
    }

    return this.router.parseUrl(url);



  }

}
