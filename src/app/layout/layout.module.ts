import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
// import {AlertModule, BsDropdownModule, CollapseModule} from 'ngx-bootstrap';
import {HeaderComponent} from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import {NotifyComponent} from './header/notify/notify.component';
import {NotifyService} from './header/notify/notify.service';
import {NavbarComponent} from './navbar/navbar.component';
import {MenuComponent} from './header/menu/menu.component';
import {PaginationComponent} from './pagination/pagination.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormControlStaticComponent } from './form/form-control-static.component';
import { FormControlComponent } from './form/form-control.component';
import { ConfirmDialogComponent } from './form/confirm-dialog.component';
import { ConfirmService } from './form/confirm.service';
import { InfoDialogComponent } from './form/info-dialog.component';
import { InfoService } from './form/info.service';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        NgbModule,
        FontAwesomeModule,
        TranslateModule,
        // SharedModule,
        // BsDropdownModule.forRoot(),
        // CollapseModule.forRoot(),
        // AlertModule.forRoot()
    ],
  declarations: [
    HeaderComponent,
    NotifyComponent,
    FooterComponent,
    NavbarComponent,
    MenuComponent,
    PaginationComponent,
    FormControlStaticComponent,
    FormControlComponent,
    ConfirmDialogComponent,
    InfoDialogComponent
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    NotifyComponent,
    HeaderComponent,
    PaginationComponent,
    FormControlStaticComponent,
    FormControlComponent,
    FontAwesomeModule,
    ConfirmDialogComponent,
    InfoDialogComponent
  ],
  providers: [
    NotifyService,
    ConfirmService,
    InfoService
  ]
})

export class LayoutModule {
  constructor(private library: FaIconLibrary) {
    library.addIconPacks(fas);
  }
}
