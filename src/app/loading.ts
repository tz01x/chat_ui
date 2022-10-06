import {  Observable, finalize } from 'rxjs';

export class InteractiveLoading{
    public obs$: Observable<any>;
    public isLoading:boolean;
    constructor(obs$:Observable<any>){
        this.isLoading=true;
        this.obs$ = obs$.pipe(finalize(()=>{
            this.isLoading=false;
        }))
    }
    
}