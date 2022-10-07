import { Directive,ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appContentRef]'
})
export class ContentRefDirective {

  constructor(public viewContainerRef:ViewContainerRef) { }

}
