import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ToasterService} from 'angular2-toaster';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public userProfileName = '';
  public getCurrentUser;
  public userProfile;
  public firstName;
  public lastName;

  constructor() {
  }

  ngOnInit() {
    this.getCurrentUser = localStorage.getItem('currentUser');
    if (this.getCurrentUser) {
      this.userProfile = JSON.parse(this.getCurrentUser).user;
      this.firstName = this.userProfile.firstName;
      this.lastName = this.userProfile.lastName;

      if (this.userProfileName.length > 11) {
        this.userProfileName = this.userProfileName.slice(0, 11) + '...';
      }
    }
  }
}
