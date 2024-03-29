import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable, inject } from '@angular/core';
import { EMPTY, Observable, catchError, filter, of, switchMap, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppStateService } from './app-state.service';
import { TokenService } from './token.service';
import { Router } from '@angular/router';


@Injectable()
export class ApiAuthHttpInterceptorService implements HttpInterceptor {
  appStatus = inject(AppStateService);
  tokenService = inject(TokenService);
  router = inject(Router);

  regx = new RegExp(environment.api);
  private isRefreshing = false;


  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  
    if (this.regx.test(req.url)) {
      
        const tkn = this.tokenService.getTokenValue()
        const request = this.addTokenHeader(req, tkn?.access_token??null);

        return next.handle(request)
        .pipe(
          catchError(
            (error: HttpErrorResponse) => {
              if (error.status == 401) {
                return this.handleUnauthorizeError(req, next);
              }
              return throwError(() => error);
            })

        );
      
      

    }
    return next.handle(req);

  }

  handleUnauthorizeError(req: HttpRequest<any>, next: HttpHandler) {
    if(!this.isRefreshing){
      this.isRefreshing = true;
      return this.tokenService.refreshToken().pipe(
        switchMap((value)=>{
          this.isRefreshing = false;
          const request = this.addTokenHeader(req, value.access_token);
          return next.handle(request);
      }),
      catchError((error:HttpErrorResponse)=>{
        this.isRefreshing = false;
        this.tokenService.setToken(null);
        
        this.router.navigate(['/login']);
      
        return throwError(()=>error);
        
      })
      )
    }
    return throwError(()=>"Try again in few second later");

  }

  private addTokenHeader(request: HttpRequest<any>, accessToken: string|null) {

    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }
}
