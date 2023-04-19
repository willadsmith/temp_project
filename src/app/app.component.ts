import {Component, OnInit} from '@angular/core';
import {ActivatedRouteSnapshot, NavigationEnd, Router, RoutesRecognized} from '@angular/router';

import { AuthenticationService } from './_services';
import { User } from './_models';
import { ToasterConfig } from 'angular2-toaster';

@Component({ selector: 'app-main', templateUrl: 'app.component.html' })
export class AppComponent implements OnInit {
    currentUser: User;
    isLoginPage: boolean;
    isBasePage = true;

    public config: ToasterConfig =
      new ToasterConfig({
        showCloseButton: true,
        tapToDismiss: false
      });
    public isMenuOpened = false;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }

    ngOnInit() {
      this.router.events.subscribe((event: any) => {
        if (event instanceof RoutesRecognized) {
          if (event && event.url) {
            if ((event.url === '/' || event.url.startsWith('/?') || event.url.includes('login') || event.url.includes('qr-verify'))) {
              this.isLoginPage = true;
            } else {
              this.isLoginPage = false;
            }
            if (event.url.startsWith('/base')) {
              this.isBasePage = true;
            } else {
              this.isBasePage = false;
            }
          } else {
            this.isLoginPage = true;
            this.isBasePage = false;
          }
          // console.log('isBasePage: ' + this.isBasePage);
          // console.log('isLoginPage: ' + this.isLoginPage);
        }
      });
    }

    toggleMenuState(e?) {
      this.isMenuOpened = !this.isMenuOpened;
    }
}
