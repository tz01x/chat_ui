import { Directive,ViewContainerRef } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[appContentRef]'
})
export class ContentRefDirective {

  constructor(public viewContainerRef:ViewContainerRef) { }

}
