import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '@app/_services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login-base.component.html',
  styleUrls: ['./login-base.component.scss']
})
export class LoginBaseComponent implements OnInit, OnDestroy {
    email: string;
    password: string;

    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';
    // email: string;

    constructor(
        private toastr: ToastrService,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
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
            this.toastr.error('Неверно указан логин или пароль', 'Ошибка авторизации');
            this.error = error;
            this.loading = false;
        });
  }

  ngOnDestroy() {
  }

}
