import { Directive,ElementRef, Renderer2 } from '@angular/core';

/**
 * Generated class for the HasPermission directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[has-permission]' // Attribute selector
})
export class HasPermission {

  constructor( el:ElementRef, renderer: Renderer2) {
    console.log('Hello HasPermission Directive');
  }

}
