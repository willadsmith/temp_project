import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '@app/_services';

@Injectable({ providedIn: 'root' })
export class PublicPageGuard implements CanActivate {
  constructor(private router: Router,
              private authenticationService: AuthenticationService) {}

  canActivate() {
    const currentUser = this.authenticationService.currentUserValue;

    if (currentUser && currentUser.user['role'] === 'USER') {
      this.router.navigate(['/cabinet']);
    } else if (currentUser && currentUser.user['role'] === 'ADMIN') {
      this.router.navigate(['/base/dashboard']);
    }
    return true;
  }
}
