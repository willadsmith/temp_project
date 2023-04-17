import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '@app/_services';

@Injectable({ providedIn: 'root' })
export class BaseGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;
        if (currentUser && currentUser.user['role'] === 'ADMIN') {
            // logged in so return true
            return true;
        }

        if (currentUser && currentUser.user['role'] === 'USER') {
            this.router.navigate(['/cabinet']);
            // , { queryParams: { returnUrl: state.url } }
            // logged in so return true
            return false;
        }

        // if (currentUser) {
        //     // logged in so return true
        //     return true;
        // }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/base/login']);
      // , { queryParams: { returnUrl: state.url } }
        return true;
    }
}
