import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import * as lodash from 'lodash';
import {CompanyDetailService} from '@app/_services/company-detail.service';
// import {AuthService} from '../../core/services/auth.service';
// import {UserProfileService} from '../../core/services/user-profile.service';
// import {CommunicateService} from '../../core/services/communicate.service';

interface LanguageInterface {
  code: string;
  name: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent {

  @Input() isMenuOpened = false;
  @Output() toggleMenuState = new EventEmitter<boolean>();

  public currentUrl: string;
  public userProfileName = '';
  public getCurrentUser;
  public companyProfile;
  public companyName;

  public currentLanguage: LanguageInterface;

  public availableLanguages: Array<LanguageInterface> = [
    {code: 'kz', name: 'Қаз'},
    {code: 'ru', name: 'Рус'},
    {code: 'en', name: 'Eng'}
  ];

  public isLogged = false;

  constructor(private router: Router,
              private companyDetailService: CompanyDetailService,
              // private authService: AuthService,
              // private userProfileService: UserProfileService,
              private location: Location,
              // private communicateService: CommunicateService
              ) {

    this.updateCompanyName();
    this.currentUrl = router.url;
    this.companyDetailService.companyInfoFunction.subscribe((name: string) => {
      this.updateCompanyName();
    });
    // this.currentLanguage = this.availableLanguages.find(value => value.code === localStorage.getItem('SB.Language'));
  }

  public updateCompanyName() {
    console.log('updateCompanyName');
    this.getCurrentUser = localStorage.getItem('currentUser');
    if (this.getCurrentUser) {
      // console.log(JSON.parse(this.getCurrentUser));
      this.companyProfile = JSON.parse(this.getCurrentUser).company;
      if (this.companyProfile) {
        this.companyName = lodash.unescape(this.companyProfile.name);
      }
    }
  }

  public setLanguage(lang: string) {
    // this.communicateService.publish('change-language', lang);
    this.currentLanguage = this.availableLanguages.find(value => value.code === lang);
  }

  toggleMenu(e) {
    e.preventDefault();
    this.isMenuOpened = !this.isMenuOpened;
    this.toggleMenuState.emit(this.isMenuOpened);
  }

  goBack(): void {
    this.location.back();
  }
}
