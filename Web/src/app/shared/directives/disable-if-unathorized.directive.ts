import { Directive, ElementRef, OnInit, Input } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';

@Directive({
    selector: '[disableIfUnauthorized]'
})
export class DisableIfUnauthorizedDirective implements OnInit {
    @Input('disableIfUnauthorized') permission: any[]; // Required permission passed in

    constructor(private el: ElementRef, private authService: AuthenticationService) { }

    ngOnInit() {
        let currentUserRole = this.authService.userRole.value;
        if (this.permission && this.permission.length>0 && this.permission.indexOf(currentUserRole) === -1) {
            this.el.nativeElement.disabled = true;
        }
    }
}