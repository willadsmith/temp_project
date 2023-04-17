import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '@app/_services';
import { ToastrService } from 'ngx-toastr';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login-base.component.html',
  styleUrls: ['./login-base.component.scss'],
  providers: [TranslatePipe]
})
export class LoginBaseComponent implements OnInit, OnDestroy {
    email: string;
    password: string;

    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';
    currentLang;
    // email: string;

    constructor(
        private toastr: ToastrService,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private translatePipe: TranslatePipe,
        private translateService: TranslateService
    ) {
      this.currentLang = this.translateService.currentLang;
      // redirect to home if already logged in
      if (this.authenticationService.currentUserValue) {
          this.router.navigate(['/base/dashboard']);
      }
    }

  ngOnInit() {
    //   this.loginForm = this.formBuilder.group({
    //       username: ['', Validators.required],
    //       password: ['', Validators.required]
    //   });

    //   // get return url from route parameters or default to '/'
    //   this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
//   get f() { return this.loginForm.controls; }

  onLogin(event: any) {
    this.email = event.target.value;
  }

  onPass(event: any) {
    this.password = event.target.value;
  }

  setLang(lang: string) {
    localStorage.setItem('lang', lang);
    this.translateService.use(lang);

    this.currentLang = this.translateService.currentLang;
  }

  onSubmit() {
    this.authenticationService.logout();
    this.submitted = true;

      // stop here if form is invalid
    //   if (this.loginForm.invalid) {
    //       return;
    //   }

    this.loading = true;
    this.authenticationService.loginOperator(this.email, this.password)
        .pipe(first())
        .subscribe(
            data => {
            this.returnUrl = '/base/dashboard';
            this.router.navigate([this.returnUrl]);
            },
            error => {
            this.toastr.error(this.translatePipe.transform('login_error_login_password'), this.translatePipe.transform('login_error_auth'));
            this.error = error;
            this.loading = false;
        });
  }

  ngOnDestroy() {
  }

}
