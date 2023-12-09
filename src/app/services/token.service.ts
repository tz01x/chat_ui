import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, Subject, retry, tap } from 'rxjs';
import { IToken } from '../interfaces';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AppStateService } from './app-state.service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private http = inject(HttpClient);

  private _token = new BehaviorSubject<IToken | null>(null);
  private refresh_token_url = `${environment.api}/refresh-access-token`

  public get token():Observable<IToken | null> {
    return this._token.asObservable()
  }
  public getTokenValue(){
    return this._token.getValue()
  }
  public setToken(value: IToken|null) {
    this._token.next(value);
    this.saveToken(value);
  }

  constructor() { }

  saveToken(value:IToken|null){
    localStorage.setItem('token-service',JSON.stringify(value))
  }

  loadToken(){
    const data = localStorage.getItem('token-service');
    if(data){
      this.setToken(JSON.parse(data));
    }
    return data??null;
  }

  clearToken(){
    this.saveToken(null);
    localStorage.removeItem('token-service');
  }

  refreshToken() {
    const tkn =  this._token.getValue()
    const payload = {
      'refresh_token':  tkn?.refresh_token
    }
    return this.http.post<IToken>(this.refresh_token_url, payload)
    .pipe(
      retry(2),
      tap((value) => {
        this.setToken(null);
      })
    )
  }

}
