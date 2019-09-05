import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication.service';



@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {}
    
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        console.log("ActivatedRouteSnapshot:"+route);
        console.log("RouterStateSnapshot:"+state);
        let isAuthorized=false;
        let currentUserRole;
         currentUserRole=JSON.parse(localStorage.getItem('userRole'));
        
        // let currentUserRole = this.authenticationService.userRole.value;
        if (currentUserRole!=null && currentUserRole.length>0) {
           for(let element of currentUserRole) {
                // check if route is restricted by role
            if (route.data.roles && route.data.roles.indexOf(element) === -1) {
                // role not authorised so redirect to home page
                this.router.navigate(['/']);
                isAuthorized=false;
            }
            else
            {
            // authorised so return true
            isAuthorized=true;
            break;
            }
            }
            //********uncomment it after uthorization if fully functional******/////////
            if(isAuthorized)
            return true;
            else
            return false;
        }
        //********remove it after uthorization if fully functional******/////////
        // return true;
        // not logged in so redirect to login page with the return url
        // this.router.navigate(['/dashboard']);
        return false;
    }
}