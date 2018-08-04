import {Directive, ElementRef, Input, Renderer2} from '@angular/core';

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

    rolePermission:any;
    modulePermission:any;

  constructor( public el:ElementRef, public renderer: Renderer2) {
    // console.log('Hello HasPermission Directive');
    this.modulePermission = [];

  }

  @Input('has-permission') permission:string;

    ngOnInit(){
        // console.log(this.permission);
        if(window.localStorage.getItem('rolePermissions')){
            this.rolePermission = JSON.parse(window.localStorage.getItem('rolePermissions'));
            // console.log("Role permissions in directive");
            // console.log(this.rolePermission);
            for(let rp of this.rolePermission){
                this.modulePermission.push(rp.moduleName+rp.actionName);
            }

            this.setModulePermission(this.permission,this.permission);
        }

    }

    setModulePermission(module,id){
        console.log(module)
        if(this.modulePermission.find(x=> x==module)){
            // console.log(module+" permission found");
        }else{
            // console.log(module+" permission not found");
            this.renderer.setStyle(this.el.nativeElement,'display','none');
        }
    }

}
