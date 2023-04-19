import {Component, OnInit} from '@angular/core';
// import {AuthService} from '../../../core/services/auth.service';
import {Router} from '@angular/router';
import { AuthenticationService } from '@app/_services';
// import {NewsService} from '../../../pages/news/services/news.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

export class MenuComponent implements OnInit {
  public currentUrl: string;

  constructor(
              private authenticationService: AuthenticationService,
    // private authService: AuthService,
              // private offersService: NewsService,
              private router: Router) {
    this.currentUrl = router.url;
  }

  logout(): void {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  goToNews() {
    // this.offersService.news = undefined;
    // this.router.navigate(['/news']);
  }

  ngOnInit() {
  }
}
