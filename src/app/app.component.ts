import {Component, OnInit} from '@angular/core';
import {ActivatedRouteSnapshot, NavigationEnd, Router, RoutesRecognized} from '@angular/router';

import { AuthenticationService } from './_services';
import { User } from './_models';
import { ToasterConfig } from 'angular2-toaster';
import {TranslateService} from '@ngx-translate/core';

@Component({ selector: 'app-main', templateUrl: 'app.component.html' })
export class AppComponent implements OnInit {
    currentUser: User;
    isLoginPage: boolean;
    isBasePage = true;
    lang: string

    public config: ToasterConfig =
      new ToasterConfig({
        showCloseButton: true,
        tapToDismiss: false
      });
    public isMenuOpened = false;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private translate: TranslateService
    ) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }

    ngOnInit() {
      if (localStorage.getItem('lang') === 'ru' || localStorage.getItem('lang') === 'kz') {
        this.translate.use(localStorage.getItem('lang'));
      } else {
        // Set default language
         localStorage.setItem('lang', 'ru');
         this.translate.use('ru');
      }

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
