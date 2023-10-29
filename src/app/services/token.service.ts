import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Subject, retry, tap } from 'rxjs';
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

  public get token(): IToken | null {
    return this._token.getValue();
  }
  public set token(value: IToken|null) {
    this._token.next(value);
    this.saveToken(value);
  }

  constructor() { }

  saveToken(value:IToken|null){
    localStorage.setItem('token-service',JSON.stringify(value))
  }

  loadToken(){
    const data = localStorage.getItem('token-service');
    this.token = data?JSON.parse(data):null;
    return this.token;
  }

  clearToken(){
    this.token = null;
    localStorage.removeItem('token-service');
  }

  refreshToken() {
    const payload = {
      'refresh_token': this.token?.refresh_token
    }
    return this.http.post<IToken>(this.refresh_token_url, payload)
    .pipe(
      retry(2),
      tap((value) => {
        this.token = value
      })
    )
  }

}
