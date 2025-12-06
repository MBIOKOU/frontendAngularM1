import { Directive, ElementRef} from '@angular/core';

@Directive({
  selector: '[appEnRetard]',
  standalone: true
})
export class EnRetard {

  constructor(el : ElementRef) { 
    const n = el.nativeElement;
     n.style.color = "red";
     n.style.fontWeight = "bold";
     n.style.border = "2px solid red";
     n.style.padding = "5px";
     n.style.borderRadius = "5px";
  }

}