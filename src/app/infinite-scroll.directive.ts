
import { Output, SimpleChanges } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { OnChanges } from '@angular/core';
import { AfterViewChecked } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Directive, ElementRef, Input } from '@angular/core';
import {fromEvent, Observable, Subscription, throttleTime} from 'rxjs'

@Directive({
  standalone:true,
  selector: '[appInfiniteScroll]'
})
export class InfiniteScrollDirective  implements OnDestroy , OnChanges {

  @Input('infiniteScrollDistance') infiniteScrollDistance:number = 10;
  @Input('throttleTime') _throttleTime:number = 700;
  @Input('throttleDistance') throttleDistance:number = 300;
  @Input('restThrottleDistancePointObservable') restDistancePointer:any;
  @Output('scrollingUp') scrollingUp = new EventEmitter();

  onScroll$!:Observable<any>;
  eventSubscription:Subscription[]=[];
  diffPointer:number=0;

  
  constructor(private el: ElementRef) {


    this.eventSubscription.push(
        fromEvent(this.el.nativeElement,'scroll').pipe(throttleTime(this._throttleTime)).subscribe(e=>{
        const element:Element = this.el.nativeElement;
        const diff = Math.round(element.scrollHeight - element.scrollTop );
        const topDistance =  (element.scrollHeight - (element.scrollHeight*( this.infiniteScrollDistance / 100 )));

    

        if( diff > element.clientHeight && diff > topDistance && diff > this.diffPointer){
          console.log(diff,element.clientHeight,topDistance) ;
          this.diffPointer = diff + this.throttleDistance;
          this.scrollingUp.emit('scrolling up');
        }
        
      })
    );
    
   }


   

   ngOnChanges(changes: SimpleChanges): void {
      this.diffPointer=0;
   }

   ngOnDestroy(): void {
       this.eventSubscription.forEach((sub)=>{
        sub?.unsubscribe();
       })
       
   }
  


}
