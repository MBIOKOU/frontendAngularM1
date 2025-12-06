import { Directive, ElementRef} from '@angular/core';

@Directive({
  selector: '[appNonrendu]',
  standalone: true
})
export class Nonrendu {

  constructor(el : ElementRef) { 
    const n = el.nativeElement;
     n.style.color = "red";
     n.style.border = "2px solid red";
     n.style.padding = "5px";
     n.style.borderRadius = "5px";
  }

}