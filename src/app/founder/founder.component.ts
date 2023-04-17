import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/_services';

@Component({
    templateUrl: 'founder.component.html',
    styleUrls: ['./founder.component.scss']
})
export class FoundComponent implements OnInit {
    public userObject: object;
    public roleUser: string;

    constructor(private authenticationService: AuthenticationService, private router: Router) {
        this.userObject = this.authenticationService.currentUserValue;
    }

    ngOnInit() {
        this.roleUser = this.userObject['user'].role;
    }

    goToUser() {
        this.router.navigate(['/cabinet']);
    }

    goToAdmin() {
        this.router.navigate(['/base/dashboard']);
    }
}
