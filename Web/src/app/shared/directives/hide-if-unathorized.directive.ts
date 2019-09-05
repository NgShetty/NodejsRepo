import { Directive, ElementRef, OnInit , Input } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { Roles } from 'src/app/Users/_models/user';
 
@Directive({
    selector: '[hideIfUnauthorized]'
})
export class HideIfUnauthorized implements OnInit {
    @Input('hideIfUnauthorized') permission: any[]; // Required permission passed in
    currentUserRole: any[] = [];
    constructor(private el: ElementRef, private authService: AuthenticationService) { }
 
    ngOnInit() {
        
        this.authService.userRole.subscribe((data) => {
            this.currentUserRole=data;
            if (this.currentUserRole && this.currentUserRole.length > 0 && this.currentUserRole.indexOf(Roles.SystemAdmin) === -1) {
            if (this.permission && this.permission.length>0) {
                let hideElement=false;
                for(let element of this.currentUserRole){
                    if (this.permission.indexOf(element) === -1) {
                        // this.el.nativeElement.style.display = 'none';
                        hideElement=true;
                    }
                    else
                    {
                        hideElement=false;
                        break;
                    }
                }
                if(hideElement)
                this.el.nativeElement.style.display = 'none';
            }
        }
        });
        
    }
}