import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseSidebarComponent } from './base-sidebar/sidebar.component';
import { BaseNavbarComponent } from './base-navbar/navbar.component';
import { BaseFooterComponent } from './base-footer/footer.component';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BaseDashboardComponent } from './dashboard/dashboard.component';
import { BaseUsersComponent } from './users/users.component';
import { BaseCompanyUsersComponent } from './company-users/company-users.component';
import { DeclineDocumentDialogComponent } from './dialogs/decline-document-dialog.component';
import { PassDocumentDialogComponent } from './dialogs/pass-document-dialog.component';
import { UsersSwitchCompanyDialogComponent } from './dialogs/users-switch-company-dialog.component';
import { CompanyUserUpdateDialogComponent } from './dialogs/company-user-update-dialog.component';
import { LayoutModule } from '@app/layout/layout.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        NgbModule,
        LayoutModule,
        FormsModule,
        NgSelectModule
    ],
  declarations: [
    BaseFooterComponent,
    BaseNavbarComponent,
    BaseSidebarComponent,
    BaseDashboardComponent,
    BaseUsersComponent,
    BaseCompanyUsersComponent,
    DeclineDocumentDialogComponent,
    PassDocumentDialogComponent,
    UsersSwitchCompanyDialogComponent,
    CompanyUserUpdateDialogComponent
  ],
  exports: [
    BaseFooterComponent,
    BaseNavbarComponent,
    BaseSidebarComponent,
    BaseDashboardComponent,
    BaseUsersComponent,
    BaseCompanyUsersComponent
  ],
  entryComponents: [
    DeclineDocumentDialogComponent,
    PassDocumentDialogComponent,
    UsersSwitchCompanyDialogComponent,
    CompanyUserUpdateDialogComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BaseComponentsModule { }
