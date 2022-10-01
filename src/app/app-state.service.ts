import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  isViewPortLarge:boolean=true;
  authUser='Alex';
  isAuthUser=false;
  hasError=false;
  constructor() { }

}
