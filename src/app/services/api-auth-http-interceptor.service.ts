import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable, inject } from '@angular/core';
import { EMPTY, Observable, catchError, of, switchMap, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppStateService } from './app-state.service';
import { TokenService } from './token.service';


@Injectable()
export class ApiAuthHttpInterceptorService implements HttpInterceptor {
  appStatus = inject(AppStateService);
  tokenService = inject(TokenService);

  regx = new RegExp(environment.api);
  private isRefreshing = false;


  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  
    if (this.regx.test(req.url)) {
  
      const request = this.addTokenHeader(req, this.tokenService.token?.access_token||null);

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
    debugger;
    if(!this.isRefreshing){
      this.isRefreshing = true;
      return this.tokenService.refreshToken().pipe(
        switchMap((value)=>{
          this.isRefreshing = false;
          const request = this.addTokenHeader(req, value.access_token);
          return next.handle(request);
      }),
      catchError((error)=>{
        this.isRefreshing = false;
        this.tokenService.token = null;
        return throwError(()=>error);
      })
      )
    }
    return throwError(()=>"Try again in few second later");

  }

  private addTokenHeader(request: HttpRequest<any>, token: string|null) {

    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
