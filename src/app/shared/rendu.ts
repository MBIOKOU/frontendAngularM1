import { Directive, ElementRef} from '@angular/core';

@Directive({
  selector: '[appRendu]'
})
export class Rendu {

  constructor(el : ElementRef) { 
    const n = el.nativeElement;
     n.style.color = "green";
     n.style.border = "2px solid green";
     n.style.padding = "5px";
     n.style.borderRadius = "5px";
  }

}
