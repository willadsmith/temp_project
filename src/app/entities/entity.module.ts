import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CabinetComponent } from './cabinet/cabinet.component';
import { LegalAccountComponent } from './legal-accounts/legal-account.component';
import { LegalAccountDetailComponent } from './legal-accounts/legal-account-detail.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LayoutModule } from '@app/layout/layout.module';
import { LegalAccountVehicleDialogComponent } from './legal-accounts/legal-account-vehicle-dialog.component';
import { LegalAccountVehicleCardDialogComponent } from './legal-accounts/legal-account-vehicle-card-dialog.component';
import { ContractDetailDialogComponent } from './cabinet/contract-detail-dialog.component';
import { RenameCompanyDialogComponent } from './cabinet/rename-company-dialog.component';
import { LegalAccountSwitchDialogComponent } from './legal-accounts//legal-account-switch-dialog.component';
import { VehicleItemComponent } from './vehicle/vehicle-item.component';
import { PaymentEntriesDialogComponent } from './vehicle/payment-entries-dialog.component';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        NgbModule,
        LayoutModule,
        TranslateModule
    ],
  declarations: [
    CabinetComponent,
    LegalAccountComponent,
    LegalAccountDetailComponent,
    LegalAccountVehicleDialogComponent,
    LegalAccountVehicleCardDialogComponent,
    LegalAccountSwitchDialogComponent,
    VehicleItemComponent,
    ContractDetailDialogComponent,
    PaymentEntriesDialogComponent,
    RenameCompanyDialogComponent
  ],
  exports: [
    CabinetComponent,
    LegalAccountComponent,
    LegalAccountDetailComponent,
    VehicleItemComponent
  ],
  entryComponents: [
    LegalAccountVehicleDialogComponent,
    LegalAccountVehicleCardDialogComponent,
    LegalAccountSwitchDialogComponent,
    ContractDetailDialogComponent,
    PaymentEntriesDialogComponent,
    RenameCompanyDialogComponent
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EntityModule {}
